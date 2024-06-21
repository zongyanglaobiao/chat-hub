import  { useState } from 'react';
import { List, Avatar, Typography } from 'antd';
import {useSelector} from "react-redux";

const { Text, Title } = Typography;

const ChatGroupList = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    useSelector(state => state.group.groups)


    return (
        <div className="flex w-full">
            <div className="w-1/3 overflow-y-auto p-4 border-r">
                <List
                    itemLayout="horizontal"
                    dataSource={groups}
                    renderItem={group => (
                        <List.Item key={group.id} onClick={() => setSelectedGroup(group)}>
                            <List.Item.Meta
                                className=' cursor-pointer'
                                avatar={<Avatar size={"large"} src={group.avatar} shape={"square"} />}
                                title={<Text>{group.name}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <div className="w-2/3 p-4">
                {selectedGroup ? (
                    <>
                        <div className="mb-4">
                            <Avatar size={74} src={selectedGroup.avatar} shape={"square"}/>
                            <Title level={4} className="mt-2">{selectedGroup.name}</Title>
                        </div>
                        <Title level={5}>成员列表</Title>
                        <div className='h-320px overflow-y-auto remove-the-scroll'>
                            <List
                                itemLayout="horizontal"
                                dataSource={selectedGroup.members}
                                renderItem={member => (
                                    <List.Item key={member.id}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={member.avatar} />}
                                            title={<Text>{member.name}</Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </>
                ) : (
                    <Title   className='w-full h-full flex justify-center items-center'>请选择一个群</Title>
                )}
            </div>
        </div>
    );
};

export default ChatGroupList;
