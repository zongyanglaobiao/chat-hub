import {Avatar, Button, List, Space} from "antd";
import ChatTable from "@/component/table/ChatTable.jsx";
import {ChatList} from "@/component/list/ChatList.jsx";
import {useSelector} from "react-redux";
import {useFetch} from "@/hook/useFetch.jsx";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useEffect, useState} from "react";

const Friend = () => {
    //好友信息
    const {friendList,unprocessedList,applicationList} = useSelector(state => state.friendInfo)
    const [doQueryUserInfosResp,doQueryUserInfosProxy] = useFetch(doQueryUserInfos,[])
    const [friendInfo, setFriendInfo] = useState([])

    useEffect(() => {
        console.log('doQueryUserInfosResp',doQueryUserInfosResp)
        // doQueryUserInfosProxy(friendList.map(t => t.friendId)) && setFriendInfo(doQueryUserInfosResp)
    }, [doQueryUserInfosResp]);


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
      <ChatList data={data} pageSize={6} renderItem={(item) => (
          <List.Item>
              <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.nickname}
                  description={item.signature}
              />
              <Space>
                  <Button>删除</Button>
                  <Button>发送信息</Button>
              </Space>
          </List.Item>
      )}/>
  )
}

export default Friend


