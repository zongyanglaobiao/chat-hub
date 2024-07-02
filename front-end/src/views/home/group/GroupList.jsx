import {memo, useContext, useEffect, useState} from 'react';
import {Avatar, List, Typography} from 'antd';
import {useSelector} from "react-redux";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {useFetch} from "@/hook/useFetch.jsx";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import ChatTab from "@/component/tab/ChatTab.jsx";
import {DisplayNoneImageContext} from "@/views/App.jsx";

const { Text, Title } = Typography;

const ChatGroupList = memo(() => {
    let groupInfo = useSelector(state => state.groupInfo)
    const [doQueryUserInfosResp,doQueryUserInfosProxy] = useFetch(doQueryUserInfos)
    const [groupMemberInfo, setGroupMemberInfo] = useState([])
    const [group, setGroup] = useState(null)
    const {openOrCloseImage} = useContext(DisplayNoneImageContext)

    useEffect(() => {
        !isNullOrUndefined(doQueryUserInfosResp) && setGroupMemberInfo(doQueryUserInfosResp?.data || [])
    }, [doQueryUserInfosResp]);

    const queryGroupMember = (group) => {
        const memberIds = group?.members.map(t => t.userId)
        // 保存选中的群组
        setGroup(group)
        // 查询群成员信息
        memberIds.length > 0 && doQueryUserInfosProxy(memberIds)
    }

    //todo 删除群

    const items = [
        {
            key:1,
            label: <Title level={4}>成员列表</Title>,
            children: (
                <div className='h-320px overflow-y-auto remove-the-scroll'>
                    <List
                        itemLayout="horizontal"
                        dataSource={groupMemberInfo}
                        renderItem={member => {
                            return (
                                <List.Item key={member.id}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={member.avatar} />}
                                        title={<Text>{member.nickname}</Text>}
                                    />
                                </List.Item>
                            )
                        }}
                    />
                </div>
            )
        },
        {
            key:2,
            label: <Title level={4}>公告列表</Title>,
            children: <div>暂无数据</div>
        }
    ]

    return (
        <div className="flex w-full h-full">
            <div className="w-1/4 overflow-y-auto  remove-the-scroll">
                <List
                    bordered={true}
                    itemLayout="horizontal"
                    dataSource={groupInfo}
                    renderItem={group => (
                        <List.Item
                            style={{padding:'3px'}}
                            key={group.id}
                            className='cursor-pointer'
                            onClick={() => queryGroupMember(group)}>
                            <List.Item.Meta
                                avatar={<Avatar size={60} src={group.avatar}
                                                shape={"square"}/>}
                                title={<Text>{group.groupName}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <div className='ml-4px mr-4px w-1px h-full bg-gray'></div>
            <div className="w-3/4 h-full">
                {group ? (
                    <>
                        <div className='flex gap-col-4'>
                            <Avatar className=' cursor-pointer' size={84} src={group.avatar} shape={"square"} onClick={()=>openOrCloseImage(group.avatar)}/>
                            <Title level={3}>{group.groupName}</Title>
                        </div>
                        <div className='mt-10px'>
                            <ChatTab items={items} tabPosition={"top"}/>
                        </div>
                    </>
                ) : (
                    <Title  className='w-full h-full flex justify-center items-center'>请选择一个群</Title>
                )}
            </div>
        </div>
    );
});

export default ChatGroupList;
