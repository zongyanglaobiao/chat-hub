import {useEffect, useState} from 'react';
import {Avatar, List, Typography} from 'antd';
import {useSelector} from "react-redux";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {useFetch} from "@/hook/useFetch.jsx";
import {doQueryUserInfos} from "@/http/api/user.api.js";
import ChatTab from "@/component/tab/ChatTab.jsx";
import {ChatList} from "@/component/list/ChatList.jsx";

const { Text, Title } = Typography;

const ChatGroupList = () => {
    let groupInfo = useSelector(state => state.groupInfo)
    const [doQueryUserInfosResp,doQueryUserInfosProxy] = useFetch(doQueryUserInfos)
    const [groupMemberInfo, setGroupMemberInfo] = useState([])
    const [group, setGroup] = useState(null)

    useEffect(() => {
        !isNullOrUndefined(doQueryUserInfosResp) && setGroupMemberInfo((()=>{
            let  arr = doQueryUserInfosResp?.data
            const arr_ = doQueryUserInfosResp?.data[0]
            for (let i = 0; i < 30; i++) {
                arr.push(arr_)
            }
            return arr
        })() || [])
    }, [doQueryUserInfosResp]);

    const queryGroupMember = (group) => {
        const memberIds = group?.members.map(t => t.userId)
        // 保存选中的群组
        setGroup(group)
        // 查询群成员信息
        memberIds.length > 0 && doQueryUserInfosProxy(memberIds)
    }

    const items = [
        {
            key:1,
            label: <Title level={5}>成员列表</Title>,
            children: (
                <ChatList data={groupMemberInfo} renderItem={(item)=>{
                    return (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<Text>{item.nickname}</Text>}
                            />
                        </List.Item>
                    )
                }}/>
            )
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
                            key={group.id}
                            onClick={() => queryGroupMember(group)}>
                            <List.Item.Meta
                                className=' cursor-pointer'
                                avatar={<Avatar size={60} src={group.avatar} shape={"square"}/>}
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
                        <div>
                            <Avatar size={74} src={group.avatar} shape={"square"}/>
                            <Title level={4} className="mt-2">{group.groupName}</Title>
                        </div>
                        {/*<Title level={5}>成员列表</Title>
                        <div className='h-320px overflow-y-auto remove-the-scroll'>
                            <List
                                itemLayout="horizontal"
                                dataSource={groupMemberInfo}
                                renderItem={member => (
                                    <List.Item key={getRandomId()}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={member.avatar} />}
                                            title={<Text>{member.nickname}</Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>*/}
                        <div>
                            <ChatTab items={items}/>
                        </div>
                    </>
                ) : (
                    <Title  className='w-full h-full flex justify-center items-center'>请选择一个群</Title>
                )}
            </div>
        </div>
    );
};

export default ChatGroupList;
