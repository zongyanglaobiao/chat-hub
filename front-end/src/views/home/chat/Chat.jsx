import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import {Avatar, Button, Input, message, Timeline} from "antd";
import {useSelector} from "react-redux";
import {doGetInfo, doQueryUserInfos} from "@/http/api/user.api.js";
import {getRandomId, isBlank} from "@/lib/toolkit/util.js";
import {ClockCircleOutlined, UserOutlined} from "@ant-design/icons";
import {DrawerContext} from "@/views/home/Home.jsx";
import {getChatInfo} from "@/http/api/chat.info.api.js";
import {
    closeWebsocket,
    createMsgContent,
    newWebSocket,
    receiveOfWebsocket,
    sendOfWebsocket
} from "@/http/websocket/websocket.js";
import {HOME_SEARCH} from "@/router/index.jsx";
import {UserInfo} from "@/component/showInfo/ShowInfo.jsx";

const { Search } = Input;


function Chat() {
    const windowRef = useRef(false);
    const [window, dispatch] = useReducer(selectWindowReducer,windowRef.current,(val)=> selectWindowReducer(null,{bool:val}))

    return (
        <div className="flex w-full h-full">
            <ChatSidebar windowSelector={dispatch} windowRef={windowRef}/>
            <div className='w-0px h-full border-l rounded-md border-solid border-[#14141525]'></div>
            {window}
        </div>
    )
}

const ChatSidebar = ({windowSelector,windowRef}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const friendInfo = useSelector(state => state.friendInfo);
    const [friends, setFriends] = useState([])
    const onSearch = (value) => navigate({pathname:HOME_SEARCH,search:value},{state:location.pathname})

    const getFriendWithChatId = (data) => {
        //因为聊天室ID只会存在朋友列表身上
        return  data.map((item)=> ({...item,chatId:friendInfo.friendList.filter(t => t.friendId === item.id)[0].chatId}))
    }

    useEffect(() => {
        //请求朋友信息
        (async ()=>{
            const resp = await doQueryUserInfos(friendInfo.friendList.map(item => item.friendId))
            if (resp.code === 200) {
                setFriends(getFriendWithChatId(resp.data))
            }
        })()
    }, [friendInfo.friendList]);

    return (
        <div className='flex flex-col w-40% h-full'>
            <div className='layout-center w-full mb-2'>
                <Search className='w-90%' placeholder="input search text" onSearch={onSearch} enterButton />
            </div>
            <div className="bg-white overflow-y-scroll remove-the-scroll">
                {
                    friends.length > 0 ? friends.map((item)=>{
                            return (
                                <div key={getRandomId()} className='flex cursor-pointer hover:cursor-pointer ' onClick={()=>{
                                    //通过改变是显示公告还是聊天界面
                                    windowRef.current = !windowRef.current
                                    windowSelector({bool:windowRef.current,chatId:item.chatId})
                                }}>
                                    <Avatar src={item.avatar} shape="square" size={50}  icon={<UserOutlined />} />
                                    <div className='ml-4px'>
                                        {item.nickname}
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className='text-center'>
                            快去找志同道合的好友吧
                        </div>
                }
            </div>
        </div>
    );
};

/**
 *  聊天信息窗
 */
const InfoWindow = ({chatId}) => {
    const [chatMessages, setChatMessage] = useState([])
    const lastTextRef = useRef();
    const userInfo = useSelector(state => state.userInfo);
    const [sendText, setSendText] = useState('')
    const {setReactNode,showDrawer} = useContext(DrawerContext)

    //初始化加载如websocket初始化
    useEffect(() => {
        //查询聊天信息
        (async ()=>{
            const resp = await getChatInfo(chatId,2)
            if (resp.code === 200) {
                const records = resp.data.records;
                //防止一直重新渲染
                setChatMessage(prevState => prevState.length === records.length ? prevState : records)
            }
        })()

        //如果进入这个页面表示需要聊天则进行websocket连接
        newWebSocket(chatId);
        //如果接收到websocket的信息
        receiveOfWebsocket((data)=>{
            (async ()=>{
                //通过websocket传递的数据查询用户信息
                const resp = await doGetInfo(data.userId)
                if (resp.code === 200) {
                    setChatMessage(prevState => [...prevState,{
                        user: resp.data,
                        information: data.text
                    }])
                }
            })()
        })
        return () => {
            //关闭连接
            closeWebsocket()
        }
    }, [chatId]);

    useEffect(() => {
        if (lastTextRef.current) {
            //有最新的信息则滚动到容器底部
            lastTextRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    //发送信息处理函数
    const sendTextHandler = () => {
        //解决antd 渲染 Input值一直存在
        if (isBlank(sendText)) {
            message.warning("发送内容不能为空");
            return
        }
        sendOfWebsocket(createMsgContent(sendText, chatId, userInfo.id));
        //更新聊天集合
        setChatMessage(prevState => [...prevState, {
            user: userInfo,
            information: sendText
        }])
        setSendText('')
    }

    return (
        <main className="w-full relative h-full">
            <div className="p-4 h-400px overflow-y-scroll remove-the-scroll">
                {chatMessages.map((message) => (
                    message.user.id === userInfo.id ?
                        (<div key={getRandomId()}  className='flex items-center mb-2 justify-end'>
                            <div className="mr-2 p-2 bg-green-300 rounded">{message.information}</div>
                            <Avatar src={message.user.avatar} shape="square" size="large" icon={<UserOutlined/>}/>
                        </div>)
                        :
                        (<div key={getRandomId()}  className='flex items-center mb-2 '>
                            <Avatar
                                onClick={()=>{
                                    showDrawer()
                                    setReactNode(<UserInfo userInfo={message.user}/>)
                                }}
                                src={message.user.avatar}
                                shape="square" size="large"
                                icon={<UserOutlined/>}/>
                            <div className="ml-2 p-2 bg-green-300 rounded">{message.information}</div>
                        </div>)
                ))}
                <div ref={lastTextRef} className={'h-0 w-0'}/>
            </div>
            {/* 消息输入区域 */}
            <div className="p-4 bottom-0 absolute w-90% gap-1 ">
                <div className="layout-center w-full">
                    <Input
                        type="text"
                        value={sendText}
                        placeholder="输入消息..."
                        className="w-[80%] p-2 border border-gray-300 rounded"
                        onChange={(e) => setSendText(e.target.value)}
                        onPressEnter={sendTextHandler}
                    />
                    <Button size={"large"} className="ml-2" onClick={sendTextHandler}>
                        发送
                    </Button>
                </div>
            </div>
        </main>
    );
};

/**
 *  公告窗
 */
const AnnouncementWindow = () => {
    return (
        <div className="w-full h-full layout-center">
            <Timeline
                className='w-full'
                mode={'right'}
                items={[
                    {
                        label: '2024-04-10',
                        children: '项目开始启动',
                        color: 'green',
                    },
                    {
                        label: '2024-04-19',
                        children: '把项目构建工具从webpack改成vite',
                        color: 'green',
                    },
                    {
                        label: '2024-05-12',
                        children: '解决登录失败/TOKEN失效无法跳转到首页问题',
                        color: 'green',
                    },
                    {
                        label: '2024-05-23',
                        children: '完成websocket聊天和搜索功能',
                        color: 'green',
                    },
                    {
                        label: '2024-05-...',
                        children: (
                            <>
                                <p>todo: 聊天信息分页查询</p>
                                <p>todo: 搜索信息分页查询</p>
                            </>
                        ),
                        dot: (
                            <ClockCircleOutlined
                                style={{
                                    fontSize: '16px',
                                }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
}

/**
 * 页面选择框
 */
const selectWindowReducer = (state,action) => {
    const {bool,chatId} = action
    if (bool) {
        return <InfoWindow chatId={chatId}/>;
    }else {
        return <AnnouncementWindow/>
    }
}

export default Chat