import {memo, useRef, useState} from "react";
import {Avatar, Flex, Image, Modal, Space, Tag} from "antd";
import {AntDesignOutlined} from "@ant-design/icons";
import infoBg from '@/assets/infoBg.jpg'

/**
 *  用户信息
 */
const UserInfo = memo(({userInfo}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showText = useRef({})

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
            <Flex vertical gap={"middle"} className='m-15px'>
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
            </Flex>
        </div>
    )
})


export {UserInfo}