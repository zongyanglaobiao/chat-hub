import {Avatar, Button, List, message, Space} from "antd";
import ChatTable from "@/component/table/ChatTable.jsx";
import {ChatList} from "@/component/list/ChatList.jsx";
import {useSelector} from "react-redux";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useEffect, useState} from "react";

const Friend = () => {
    //好友信息
    const {friendList,unprocessedList,applicationList} = useSelector(state => state.friendInfo)
    const [friendInfo, setFriendInfo] = useState([])

    const fetchFriendInfo = async (friendIds) => {
        const resp = await doQueryUserInfos(friendIds)

        if (resp.code === 200) {
            return resp.data
        }

        message.error(resp.message)
        return []
    }

    useEffect(() => {
        friendList.map(t => t.friendId).length !== 0 && setFriendInfo(fetchFriendInfo(friendList.map(t => t.friendId)))
    }, [friendList]);

    // useEffect(() => {
    //     doQueryUserInfosResp.length !== 0 && setFriendInfo(doQueryUserInfosResp.data)
    // }, [doQueryUserInfosResp]);
    
    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: '1',
            children:  <ChatFriendList data={friendInfo}/>   ,
        },
        {
            label: '申请列表',
            key: '2',
            children:  <ChatFriendList data={friendInfo}/>
        },
        {
            label: '待处理好友申请',
            key: '3',
            children:  <ChatFriendList data={friendInfo}/> ,
        },
    ];

    return (
        <ChatTable  items={items} />
    )
}

const ChatFriendList = ({data}) => {
    return (
        data.length !== 0
            ?
            <ChatList data={data} pageSize={6} renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={item.nickname}
                        description={item.signature}
                        className="text-overflow"
                    />
                    <Space>
                        <Button>删除</Button>
                        <Button>发送信息</Button>
                    </Space>
                </List.Item>
            )}/>
            :
            <div>
                暂无好友
            </div>
    )
}

export default Friend


