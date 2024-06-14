import {Avatar, Button, List, message, Space} from "antd";
import ChatTable from "@/component/table/ChatTable.jsx";
import {ChatList} from "@/component/list/ChatList.jsx";
import {useSelector} from "react-redux";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useContext, useEffect, useState} from "react";
import {DisplayNoneImageContext} from "@/views/App.jsx";

const Friend = () => {
    //好友信息
    const {friendList,unprocessedList,applicationList} = useSelector(state => state.friendInfo)
    const [friendInfo, setFriendInfo] = useState([])
    const [unprocessInfo, setUnprocessInfo] = useState([])
    const [applicationInfo, setApplicationInfo] = useState([])

    const fetchFriendInfo = async (friendIds,hook) => {
        const resp = await doQueryUserInfos(friendIds)
        resp.code === 200 ?  hook(resp.data) :  message.error(resp.message)
    }

    useEffect(() => {
        friendList.map(t => t.friendId).length !== 0 && fetchFriendInfo(friendList.map(t => t.friendId),setFriendInfo)
    }, [friendList]);

    useEffect(() => {
        unprocessedList.length !== 0 && fetchFriendInfo(unprocessedList.map(t => t.friendId),setUnprocessInfo)
    }, [unprocessedList]);

    useEffect(() => {
        applicationList.length !== 0 && fetchFriendInfo(applicationList.map(t => t.friendId),setApplicationInfo)
    }, [applicationList]);
    
    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: 1,
            children:  (
                <ChatFriendList data={friendInfo}>
                    <Button>删除</Button>
                    <Button>发送信息</Button>
                </ChatFriendList>
            )   ,
        },
        {
            label: '待处理申请列表',
            key: 2,
            children:  (
                <ChatFriendList data={unprocessInfo}>
                    <Button>同意</Button>
                    <Button>拒绝</Button>
                </ChatFriendList>
            ) ,
        },
        {
            label: '申请列表',
            key: 3,
            children:  (
                <ChatFriendList data={applicationInfo}>
                    <Button>删除</Button>
                </ChatFriendList>
            )
        },
    ];

    return (
        <ChatTable  items={items} />
    )
}

const ChatFriendList = ({data,children}) => {
    const {openOrCloseImage} = useContext(DisplayNoneImageContext)
    console.log(data)
    return (
        data.length !== 0
            ?
            <ChatList data={data} pageSize={6} renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}
                                        size={45}
                                        className=" cursor-pointer"
                                        onClick={()=>openOrCloseImage(item.avatar)} />}
                        title={item.nickname}
                        description={item.signature}
                        className="text-overflow"
                    />
                    <Space className="ml-3">
                        {children}
                    </Space>
                </List.Item>
            )}/>
            :
            <div>
                暂无数据
            </div>
    )
}

export default Friend


