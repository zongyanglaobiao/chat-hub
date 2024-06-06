import {useLocation, useNavigate} from "react-router-dom";
import {memo, useContext, useEffect, useRef, useState} from "react";
import {Avatar, Button, Dropdown, Input, message, Timeline} from "antd";
import {useSelector} from "react-redux";
import {doGetInfo, doQueryUserInfos} from "@/http/api/user.api.js";
import {getRandomId, isBlank, isNullOrUndefined} from "@/lib/toolkit/util.js";
import Icon, {ClockCircleOutlined, FileImageTwoTone, PlusSquareTwoTone, UserOutlined} from "@ant-design/icons";
import {getChatInfo} from "@/http/api/chat.info.api.js";
import {
    closeWebsocket,
    createMsgContent,
    newWebSocket,
    receiveOfWebsocket,
    sendOfWebsocket
} from "@/http/websocket/websocket.js";
import {HOME_SEARCH} from "@/router/index.jsx";
import {GroupInfo, UserInfo} from "@/component/showInfo/ShowInfo.jsx";
import {DrawerContext} from "@/views/App.jsx";
import {useFetch} from "@/hook/useFetch.jsx";

const { Search } = Input;


const Chat = memo(() => {
    const location = useLocation();
    const [showInfoWindows, setShowInfoWindows] = useState({isShow:false,chatId:null})

    useEffect(() => {
        if (!isNullOrUndefined(location.state)) {
            const {chatId} = location.state
            setShowInfoWindows({isShow:true,chatId})
        }
    }, [location]);

    return (
        <div className="flex w-full h-full">
            <ChatSidebar setShowInfoWindows={setShowInfoWindows}/>
            <div className='w-0px h-full border-l rounded-md border-solid border-[#14141525]'></div>
            {
                showInfoWindows.isShow ? <InfoWindow chatId={showInfoWindows.chatId} /> : <AnnouncementWindow/>
            }
        </div>
    )
})

const ChatSidebar = ({setShowInfoWindows}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const friendInfo = useSelector(state => state.friendInfo);
    const groupInfo = useSelector(state => state.groupInfo);
    const [renderList, setRenderList] = useState([])

    const onSearch = (value) => navigate({pathname:HOME_SEARCH,search:value},{state:location.pathname})

    useEffect(() => {
        const getFriendWithChatId = (data) => {
            //因为聊天室ID只会存在朋友列表身上
            return  data.map((item)=> ({...item,chatId:friendInfo.friendList.filter(t => t.friendId === item.id)[0].chatId}))
        }

        //请求朋友信息
        (async ()=>{
            const resp = await doQueryUserInfos(friendInfo.friendList.map(item => item.friendId))
            if (resp.code === 200) {
                setRenderList(prevState => {
                    const ls = [...getFriendWithChatId(resp.data).map(t => ({...t,name:t.nickname})),...groupInfo.map(t => ({...t,chatId:t.id,name:t.groupName}))];
                    return ls.length === prevState.length ? prevState : ls
                })
            }
        })()
    }, [friendInfo.friendList,groupInfo]);

    return (
        <div className='flex flex-col w-40% h-full'>
            <div className='layout-center w-full mb-2'>
                <Search className='w-90%' placeholder="input search text" onSearch={onSearch} enterButton />
            </div>
            <div className="bg-white overflow-y-scroll remove-the-scroll">
                {
                    renderList.length > 0 ? renderList.map((item)=>{
                            return (
                                <div key={getRandomId()} className='m-5px bg-gray-100 flex cursor-pointer hover:shadow-md hover:rounded-md rounded-md' onClick={()=>{
                                    setShowInfoWindows({isShow:true,chatId:item.chatId})
                                }}>
                                    <Avatar src={item.avatar} shape="square" size={60}  icon={<UserOutlined />} />
                                    <div className='ml-4px'>
                                        {item.name}
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
const InfoWindow = memo(({chatId}) => {
    const [chatMessages, setChatMessage] = useState([])
    const lastTextRef = useRef();
    const userInfo = useSelector(state => state.userInfo);
    const [sendText, setSendText] = useState('')
    const {showDrawer} = useContext(DrawerContext)
    const [doGetInfoResp,doGetInfoProxy] = useFetch(doGetInfo)
    const {friendList} = useSelector(state => state.friendInfo)
    const groupInfo = useSelector(state => state.groupInfo);

    useEffect(() => {
        !isNullOrUndefined(doGetInfoResp?.data) && showDrawer(<UserInfo userInfo={doGetInfoResp.data}/>)
    }, [doGetInfoResp]);

    //初始化加载如websocket初始化
    useEffect(() => {
        //查询聊天信息
        (async ()=>{
            const resp = await getChatInfo(chatId,1)
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
            setChatMessage([])
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

    const items = [
        {
            key: '1',
            label: (
                <FileImageTwoTone style={{fontSize:30}} onClick={()=>{
                    message.warning("正在开发中")
                }}/>
            ),
        },
        {
            key: '2',
            label: (
                <Icon component={MoreInfoIcon} style={{fontSize:30}} onClick={()=>{
                    if (isNullOrUndefined(chatId) || isBlank(chatId)){
                        return
                    }

                    if (chatId.length > 19) {
                        doGetInfoProxy(friendList.filter(t => t.chatId === chatId)[0].friendId)
                    }else {
                        showDrawer(<GroupInfo groupInfo={groupInfo.filter(t => t.id === chatId)[0]}/>)
                    }
                }}/>
            ),
        },
        {
            key: '3',
            label: (
                <Icon component={GithubIcon} style={{fontSize:30}} onClick={()=>window.open('https://github.com/zongyanglaobiao/chat-hub')}/>
            ),
        },
    ];

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
                                    showDrawer(<UserInfo userInfo={message.user}/>)
                                }}
                                src={message.user.avatar}
                                shape="square" size="large"
                                className=" cursor-pointer"
                                icon={<UserOutlined/>}/>
                            <div className="ml-2 p-2 bg-green-300 rounded">{message.information}</div>
                        </div>)
                ))}
                <div ref={lastTextRef} className={'h-0 w-0'}/>
            </div>
            {/* 消息输入区域 */}
            <div className="p-4 bottom-0 absolute w-90% gap-1 ">
                <div className="layout-center w-full">
                    <Dropdown
                        placement="top"
                        arrow
                        destroyPopupOnHide={true}
                        menu={{
                            items
                        }}
                        trigger="click"
                    >
                        <PlusSquareTwoTone
                            style={{fontSize: 40}}
                            className='cursor-pointer relative'/>
                    </Dropdown>
                    <Input
                        type="text"
                        value={sendText}
                        placeholder="输入消息..."
                        className="w-[80%] ml-2 p-2 border border-gray-300 rounded"
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
})

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

const GithubIcon = () => {
    return (
        <svg d="1717490035250" className="icon" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             p-id="2297" fill="#1677ff" width="1em" height="1em">
            <path
                d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                p-id="2298">
            </path>
        </svg>
    )
}

const MoreInfoIcon = () => {
   return (
       <svg d="1717491140707" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="3293" fill="#1677ff" width="1em" height="1em">
           <path
               d="M512 940.6c-57.8 0-114-11.3-166.8-33.7-51-21.6-96.9-52.5-136.2-91.8s-70.2-85.2-91.8-136.2C94.8 626 83.4 569.8 83.4 512c0-57.8 11.3-114 33.7-166.8 21.6-51 52.5-96.9 91.8-136.2s85.2-70.2 136.2-91.8C398 94.8 454.2 83.4 512 83.4c57.8 0 114 11.3 166.8 33.7 51 21.6 96.9 52.5 136.2 91.8s70.2 85.2 91.8 136.2c22.4 52.9 33.7 109 33.7 166.8 0 57.8-11.3 114-33.7 166.8-21.6 51-52.5 96.9-91.8 136.2s-85.2 70.2-136.2 91.8c-52.8 22.5-109 33.9-166.8 33.9z m0-800c-99.2 0-192.5 38.6-262.6 108.8-70.2 70.1-108.8 163.4-108.8 262.6 0 99.2 38.6 192.5 108.8 262.6 70.2 70.2 163.4 108.8 262.6 108.8 99.2 0 192.5-38.6 262.6-108.8S883.4 611.2 883.4 512c0-99.2-38.6-192.5-108.8-262.6-70.1-70.2-163.4-108.8-262.6-108.8z"
               fill="#1677ff" p-id="3294"></path>
           <path d="M340.6 512m-57.1 0a57.1 57.1 0 1 0 114.2 0 57.1 57.1 0 1 0-114.2 0Z"
                 fill="#1677ff"
                 p-id="3295"></path>
           <path d="M512 512m-57.1 0a57.1 57.1 0 1 0 114.2 0 57.1 57.1 0 1 0-114.2 0Z"
                 fill="#1677ff"
                 p-id="3296"></path>
           <path d="M683.4 512m-57.1 0a57.1 57.1 0 1 0 114.2 0 57.1 57.1 0 1 0-114.2 0Z"
                 fill="#1677ff"
                 p-id="3297"></path>
       </svg>
   )
}

export default Chat