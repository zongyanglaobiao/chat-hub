import {memo, useContext, useEffect, useRef, useState} from "react";
import {Avatar, Button, Flex, Image, message, Modal, Space, Tag} from "antd";
import {AntDesignOutlined} from "@ant-design/icons";
import infoBg from '@/assets/infoBg.jpg'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {HOME_CHAT, HOME_PERSON_SETTING} from "@/router/index.jsx";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {DrawerContext} from "@/views/App.jsx";
import {useFetch} from "@/hook/useFetch.jsx";
import {doAddFriend, doDeleteFriend} from "@/http/api/friend.api.js";

/**
 *  用户信息
 */
const UserInfo = memo(({userInfo}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showText = useRef({})
    const friendInfo = useSelector(state => state.friendInfo)
    const navigate = useNavigate()
    const {closeDrawer} = useContext(DrawerContext)
    const [response,setProxyMethodParam] = useFetch(doAddFriend)
    const [deleteFriendResp,deleteFriend] = useFetch(doDeleteFriend)
    const userInfoState = useSelector(state => state.userInfo)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isNullOrUndefined(response)) {
            return
        }
        response.code === 200 && message.info(("添加成功"))
        ||
        response.code !== 200 && message.error((response.message))
    }, [response]);

    useEffect(() => {
        if (isNullOrUndefined(deleteFriendResp)) {
            return
        }
        deleteFriendResp.code === 200 && message.info(("删除成功"))
        ||
        deleteFriendResp.code !== 200 && message.error((deleteFriendResp.message))

    }, [deleteFriendResp]);

    //判断用户是否为我的好友 true 返回朋友
    const getMyFriend = () => {
       return  friendInfo?.friendList.filter(t => t.friendId === userInfo.id).length === 0  ?  null : friendInfo?.friendList[0]
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const setText = (title,text) => {
        showText.current = {title,text}
        showModal()
    }

    return (
        <div className='relative w-full'>
            <Image
                width={'100%'}
                height={200}
                className='relative'
                fallback="data:image/png;base64,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"
                src={infoBg}
            />
            {/*
                todo 把Avatar和Image叠加叠加的部分为Avatar一半的高度
            */}
            <Flex vertical gap={"middle"} className='m-15px absolute top-150px'>
                <Image
                    width={200}
                    style={{
                        display: 'none',
                    }}
                    src={userInfo.avatar}
                    preview={{
                        visible,
                        onVisibleChange: (value) => setVisible(value)
                    }}
                />
                <Avatar
                    size={{
                        xs: 24,
                        sm: 32,
                        md: 40,
                        lg: 64,
                        xl: 80,
                        xxl: 100,
                    }}
                    icon={<AntDesignOutlined/>}
                    src={userInfo.avatar}
                    onClick={()=>{
                        setVisible(true)
                    }}
                    className='cursor-pointer border-2 border-white shadow-lg'
                />
                <Space size={"large"}>
                    <Flex vertical gap={"middle"}>
                        <strong>昵称</strong>
                        <strong>个性签名</strong>
                        <strong>性别</strong>
                        <strong>邮箱</strong>
                    </Flex>
                    <Flex vertical gap={"middle"} >
                        <Tag color={"blue"}
                             onClick={()=>{setText('昵称',userInfo.nickname)}}
                             className='max-w-15rem text-overflow cursor-pointer'>
                            {userInfo.nickname}
                        </Tag>
                        <Tag color={"blue"}
                             onClick={()=>{ setText('个性签名',userInfo.signature)}}
                             className='max-w-15rem text-overflow cursor-pointer'>
                            {userInfo.signature}
                        </Tag>
                        <Tag color={"blue"}
                             onClick={()=>{setText('性别',userInfo.gender)}}
                             className='max-w-15rem text-overflow cursor-pointer'>
                            {userInfo.gender}
                        </Tag>
                        <Tag color={"blue"}
                             onClick={()=>{setText('邮箱',userInfo.mail)}}
                             className='max-w-15rem text-overflow cursor-pointer'>
                            {userInfo.mail}
                        </Tag>
                        <Modal open={isModalOpen}
                               title={showText.current.title}
                               centered
                               onCancel={closeModal}
                               onOk={closeModal}>
                            <p>{showText.current.text}</p>
                        </Modal>
                    </Flex>
                </Space>
                <div className='text-center'>
                    {
                        isNullOrUndefined(getMyFriend()) ? userInfoState.id === userInfo.id ?
                            <Button onClick={()=>{
                                closeDrawer()
                                navigate(HOME_PERSON_SETTING)
                            }}>
                                个人信息设置
                            </Button>
                            :
                            <Button onClick={()=>{
                                //申请添加好友
                                setProxyMethodParam(userInfo.id)
                            }}>申请添加好友</Button>
                            :
                            <Space>
                                <Button onClick={()=>{
                                    closeDrawer()
                                    navigate(HOME_CHAT,{state:{chatId:getMyFriend()?.chatId}})
                                }}>发送信息</Button>
                                <Button onClick={()=>{
                                    deleteFriend(userInfo.id)
                                }}>删除好友</Button>
                            </Space>
                    }
                </div>
            </Flex>
        </div>
    )
})

const GroupInfo = memo(({groupInfo}) => {
    return (
        <div>群信息</div>
    )
})

/**
 * 群信息
 */
export {UserInfo,GroupInfo}