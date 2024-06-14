import {Avatar, Button, List, message, Popover, Space} from "antd";
import ChatTable from "@/component/table/ChatTable.jsx";
import {ChatList} from "@/component/list/ChatList.jsx";
import {useDispatch, useSelector} from "react-redux";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import {useContext, useEffect, useState} from "react";
import {DisplayNoneImageContext} from "@/views/App.jsx";
import {useFetch} from "@/hook/useFetch.jsx";
import {doDeleteFriend, doNoAgreeFriend, doYesAgreeFriend} from "@/http/api/friend.api.js";
import {friendListInfoThunk} from "@/redux/feature/friend.thunk.js";
import {useNavigate} from "react-router-dom";
import {HOME_CHAT} from "@/router/index.jsx";

const Friend = () => {
    //好友信息
    const {friendList,unprocessedList,applicationList} = useSelector(state => state.friendInfo)
    const [friendInfo, setFriendInfo] = useState([])
    const [unprocessInfo, setUnprocessInfo] = useState([])
    const [applicationInfo, setApplicationInfo] = useState([])
    const [doDeleteFriendResp,doDeleteFriendProxy] = useFetch(doDeleteFriend)
    const [doYesAgreeFriendResp,doYesAgreeFriendProxy] = useFetch(doYesAgreeFriend)
    const [doNoAgreeFriendResp,doNoAgreeFriendProxy] = useFetch(doNoAgreeFriend)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchFriendInfo = async (friendIds,hook) => {
        if (friendIds.length === 0) {
            return []
        }
        const resp = await doQueryUserInfos(friendIds)
        resp.code === 200 ?  hook(resp.data) :  message.error(resp.message)
    }

    //查询好友列表
    useEffect(() => {
        fetchFriendInfo(friendList.map(t => t.friendId),setFriendInfo)
    }, [friendList]);

    //查询处理列表
    useEffect(() => {
        fetchFriendInfo(applicationList.map(t => t.friendId),setApplicationInfo)
    }, [applicationList]);

    //查询待处理列表
    useEffect(() => {
        console.log('unprocessedList',unprocessedList)
        fetchFriendInfo(unprocessedList.map(t => t.userId),setUnprocessInfo)
    }, [unprocessedList]);

    //更新好友列表
    useEffect(() => {
        dispatch(friendListInfoThunk())
    }, [doDeleteFriendResp,doYesAgreeFriendResp,doNoAgreeFriendResp]);

    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: 1,
            children:  (
                <ChatFriendList data={friendInfo} renderButton={(item)=>{
                    return (
                        <>
                            <Button onClick={()=>{
                                doDeleteFriendProxy(item.id)
                            }}>删除</Button>
                            <Button onClick={()=>{
                                navigate(HOME_CHAT,{state:{chatId:friendList.filter(t => t.friendId === item.id)[0].chatId}})
                            }}>发送信息</Button>
                        </>
                    )
                }}/>

            ),
        },
        {
            label: (
                <Popover
                    content={(
                        <p>
                            别人申请成为我的好友
                        </p>
                    )} >
                    待处理列表
                </Popover>
            ),
            key: 2,
            children:  (
                <ChatFriendList data={unprocessInfo} renderButton={(item)=>{
                    return (
                        <>
                            <Button onClick={()=>{
                                doYesAgreeFriendProxy(unprocessedList.filter(t => t.userId === item.id)[0].id)
                            }}>同意</Button>
                            <Button onClick={()=>{
                                doNoAgreeFriendProxy(unprocessedList.filter(t => t.userId === item.id)[0].id)
                            }}>拒绝</Button>
                        </>
                    )
                }}/>
            ) ,
        },
        {
            label: (
                <Popover
                    content={(
                        <p>
                            我申请成为好友
                        </p>
                    )}>
                    申请列表
                </Popover>
            ),
            key: 3,
            children:  (
                <ChatFriendList data={applicationInfo} renderButton={(item)=>{
                    return (
                        <>
                            <Button onClick={()=>{
                                doDeleteFriendProxy(item.id)
                            }}>删除</Button>
                        </>
                    )
                }}/>
            )
        }
    ];

    return (
        <ChatTable items={items} onChange={()=>{
            dispatch(friendListInfoThunk())
        }}/>
    )
}

const ChatFriendList = ({data,renderButton}) => {
    const {openOrCloseImage} = useContext(DisplayNoneImageContext)
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
                        {renderButton(item)}
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


