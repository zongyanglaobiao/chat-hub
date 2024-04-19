/*
import {Button} from "antd";
import {useSelector} from "react-redux";
import {getRandomId} from "../../../../lib/common/util";


export const ChatWindow = () => {
    return (
        <div className="flex w-full h-full">
            <ChatSidebar className="w-[30%] h-full"/>
            <Window/>
        </div>
    )
}


const ChatSidebar = ({className}) => {
    const friendInfo = useSelector(state => state.friendInfo);
    console.log(friendInfo)
    return (
        <aside className={"w-60 bg-white overflow-y-scroll " + className}>
            {
               friendInfo.map((item)=>{
                    return (
                        <div key={getRandomId()}>
                            <img src={item.avatar} alt=""/>
                            <div>
                                {item.nickname}
                            </div>
                        </div>
                    )
                })
            }
        </aside>
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
            {/!* 消息输入区域 *!/}
            <div className="p-4 bottom-0 absolute w-[90%] gap-1 ">
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
*/
