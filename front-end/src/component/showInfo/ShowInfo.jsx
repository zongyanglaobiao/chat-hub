import {memo, useContext, useEffect, useRef, useState} from "react";
import {Avatar, Button, Flex, Image, message, Modal, Space, Tag} from "antd";
import {AntDesignOutlined} from "@ant-design/icons";
import infoBg from '@/assets/infoBg.jpg'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {HOME_CHAT, HOME_PERSON_SETTING} from "@/router/index.jsx";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {DisplayNoneImageContext, DrawerContext} from "@/views/App.jsx";
import {useFetch} from "@/hook/useFetch.jsx";
import {doAddFriend, doDeleteFriend} from "@/http/api/friend.api.js";
import {DisplayNoneImage} from "@/component/image/DisplayImage.jsx";

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
    const {openOrCloseImage} = useContext(DisplayNoneImageContext)

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
                src={infoBg}
            />
            <Flex vertical gap={"middle"} className='m-15px absolute top-150px'>
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
                    onClick={()=>openOrCloseImage(userInfo.avatar)}
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
    const {openOrCloseImage} = useContext(DisplayNoneImageContext)

    return (
        <div className='relative w-full'>
            <Image
                width={'100%'}
                height={200}
                className='relative'
                src={infoBg}
            />
            <Flex vertical gap={"middle"} className='m-15px absolute top-150px'>
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
                    src={groupInfo.avatar}
                    onClick={()=>openOrCloseImage(groupInfo.avatar)}
                    className='cursor-pointer border-2 border-white shadow-lg'
                />
            </Flex>
        </div>
    )
})

/**
 * 群信息
 */
export {UserInfo,GroupInfo}