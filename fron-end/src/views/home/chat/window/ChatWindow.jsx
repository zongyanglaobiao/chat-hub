import {useSelector} from "react-redux";
import {Button, message} from "antd";
import Search from "antd/es/input/Search.js";
import {useNavigate} from "react-router-dom";
import {HOME_CHAT_SEARCH} from "@/router/index.jsx";
import {getRandomId} from "@/lib/toolkit/util.js";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useEffect, useState} from "react";


const ChatWindow = () => {
    return (
        <div className="flex w-full h-full">
            <ChatSidebar/>
            <div className='w-0px h-full border-l rounded-md border-solid border-[#14141525]'></div>
            <Window/>
        </div>
    )
}


const ChatSidebar = ({className}) => {
    const navigate = useNavigate();
    const friendInfo = useSelector(state => state.friendInfo);
    const [friends, setFriends] = useState([])
    const onSearch = (value, _e, info) => navigate(HOME_CHAT_SEARCH);

    useEffect(() => {
        //请求朋友信息
        (async ()=>{
          const resp = await doQueryUserInfos(friendInfo.friendList.map(item => item.friendId))
            if (resp.code === 200) {
                setFriends(resp.data)
            }else {
                message.error(resp.message)
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
                               <div key={getRandomId()}>
                                   <img src={item.avatar} alt=""/>
                                   <div>
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

const Window = () => {
    // 假设messages是你的消息列表
    const messages = [
        { author: 'Jelly', text: '哈哈哈！你好LaravelChen!' },
        { author: 'Tom', text: '你好啊！我是Tom!' }
        // 更多消息...
    ];

    return (
        <main className="w-full relative h-full">
            <div className="p-4">
                {messages.map((message, index) => (
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
                    <Button className="ml-2">
                        发送
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default ChatWindow;
