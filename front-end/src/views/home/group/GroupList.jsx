import  { useState } from 'react';
import { List, Avatar, Typography } from 'antd';

const { Text, Title } = Typography;

const ChatGroupList = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);

    const groups = (()=>{
        const group = []
        for (let i = 0; i < 30; i++) {
            group.push({
                id: i,
                name: '群' + i,
                avatar: 'https://example.com/group1.png',
                members: (()=>{
                    const member = []
                    for (let j = 0; j < 30; j++) {
                        member.push({
                            id: j,
                            name: '成员' + j,
                            avatar: 'https://example.com/avatar.png',
                        })
                    }
                    return member
                })()
            })
        }
        return group
    })()

    return (
        <div className="flex w-full">
            <div className="w-1/3 overflow-y-auto p-4 border-r">
                <List
                    itemLayout="horizontal"
                    dataSource={groups}
                    renderItem={group => (
                        <List.Item key={group.id} onClick={() => setSelectedGroup(group)}>
                            <List.Item.Meta
                                avatar={<Avatar src={group.avatar} />}
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
                            <Avatar size={64} src={selectedGroup.avatar} />
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
