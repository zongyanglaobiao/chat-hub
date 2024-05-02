import {useSelector} from "react-redux";
import {Avatar, Button} from "antd";
import Search from "antd/es/input/Search.js";
import {useNavigate} from "react-router-dom";
import {HOME_CHAT_SEARCH} from "@/router/index.jsx";
import {getRandomId} from "@/lib/toolkit/util.js";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useEffect, useReducer, useRef, useState} from "react";
import {UserOutlined} from "@ant-design/icons";
import {getChatInfo} from "@/http/api/chat.info.api.js";
import {closeWebsocket, newWebSocket} from "@/http/websocket/websocket.js";

/**
 * 聊天类型
 */
const CHAT_TYPE_FRIEND = "friend";
const CHAT_TYPE_GROUP = "group";

const ChatWindow = () => {
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
    const navigate = useNavigate();
    const friendInfo = useSelector(state => state.friendInfo);
    const userInfo = useSelector(state => state.userInfo);
    const [friends, setFriends] = useState([])
    const onSearch = (value, _e, info) => navigate(HOME_CHAT_SEARCH);

    const getChatId = (friendId) => {
        return  friendInfo.friendList.filter(t => t.userId === userInfo.id && t.friendId === friendId)[0].chatId
    }

    useEffect(() => {
        //请求朋友信息
        (async ()=>{
          const resp = await doQueryUserInfos(friendInfo.friendList.map(item => item.friendId))
            if (resp.code === 200) {
                setFriends(resp.data)
            }
        })()
    }, [friendInfo.friendList]);

    return (
       <div className='flex flex-col w-40% h-full'>
           <div className='layout-center w-full mb-2'>
               <Search className='w-90%' placeholder="input search text" onSearch={onSearch} enterButton />
           </div>
           <div className="bg-white overflow-y-scroll remove_the_scroll">
               {
                   friends.length > 0 ? friends.map((item)=>{
                           return (
                               <div key={getRandomId()} className='flex cursor-pointer hover:cursor-pointer ' onClick={()=>{
                                   windowRef.current = !windowRef.current
                                   windowSelector({bool:windowRef.current,content:{chatId:getChatId(item.id),type:CHAT_TYPE_FRIEND}})
                               }}>
                                   <Avatar src={item.avatar} shape="square" size="large" icon={<UserOutlined />} />
                                   <div className='ml-4px'>
                                       {item.nickname}
                                   </div>
                               </div>
                           )
                       })
                       :
                       <div>
                           去和志同道合的好友聊天吧
                       </div>
               }
           </div>
       </div>
    );
};

/**
 *  信息聊天窗
 */
const InfoWindow = ({content}) => {
    const [chatMessage, setChatMessage] = useState([])
    const  {type,chatId} = content

    useEffect(() => {
        //如果进入这个页面表示需要聊天则进行websocket连接
        newWebSocket(chatId)

        return () => {
            //关闭连接
            closeWebsocket()
        }
    }, []);

    useEffect(() => {

        //查询聊天信息
        (async ()=>{
            console.log('chatId',chatId)
           const resp = await getChatInfo(chatId)
            if (resp.code === 200) {
                const records = resp.data.records;
                setChatMessage(prevState => records.length > 0 ? records : prevState)
            }
        })()
    }, [chatMessage]);


    return (
        <main className="w-full relative h-full">
            <div className="p-4">
                {chatMessage.map((message, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <img src={`path_to_${message.author.toLowerCase()}_avatar`} alt={message.author} className="w-8 h-8 rounded-full" />
                        <div className="ml-2 p-2 bg-green-300 rounded">{message.text}</div>
                    </div>
                ))}
            </div>
            {/* 消息输入区域 */}
            <div className="p-4 bottom-0 absolute w-90% gap-1 ">
                <div className="layout-center w-full">
                    <input

                        type="text"
                        placeholder="输入消息..."
                        className="w-[80%] p-2 border border-gray-300 rounded"
                    />
                    <Button className="ml-2" onClick={()=> {

                    }}>
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
            <h3>
                公告：生活就是在聊天中过去的
            </h3>
        </div>
    );
}

const selectWindowReducer = (state,action) => {
    const {bool,content} = action
    if (bool) {
        return <InfoWindow content={content}/>;
    }else {
        return <AnnouncementWindow/>
    }
}

export default ChatWindow;
