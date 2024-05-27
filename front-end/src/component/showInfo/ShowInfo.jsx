import {memo} from "react";
import {Avatar, Flex, Input, Space, Tag} from "antd";
import {AntDesignOutlined} from "@ant-design/icons";

/**
 *  用户信息
 */
const UserInfo = memo(({userInfo}) => {
    return (
        <Flex vertical gap={"middle"}>
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
            <Space>
                <Flex vertical gap={"middle"}>
                    <strong>昵称</strong>
                    <strong>个性签名</strong>
                    <strong>性别</strong>
                    <strong>邮箱</strong>
                </Flex>
                <Flex vertical gap={"middle"}>
                    <Tag color={"blue"}>{userInfo.nickname}</Tag>
                    <Tag color={"blue"}>{userInfo.signature}</Tag>
                    <Tag color={"blue"}>{userInfo.gender}</Tag>
                    <Tag color={"blue"}>{userInfo.mail}</Tag>
                </Flex>
            </Space>
        </Flex>
    )
})


export {UserInfo}