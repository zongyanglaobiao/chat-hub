import {Avatar, Button, Divider, Flex, List, Space, Tabs} from "antd";
import {useSelector} from "react-redux";
import ChatTable from "@/component/table/ChatTable.jsx";
import {useEffect} from "react";
import {ChatList} from "@/component/list/ChatList.jsx";

// 封装Tab内容为函数
const RenderTabContent = (data, isStatusVisible = false) => (
    <List
        dataSource={data}
        renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<div style={{ textAlign: 'center' }}>{`${item.name}${isStatusVisible ? ` - ${item.status}` : ''}`}</div>}
                />
                <Divider />
            </List.Item>
        )}
    />
);

/*export const Friend_ = () => {
    const friendInfo =  useSelector(state => state.friendInfo)


    // 示例数据
    const friends = [
        { id: 1, name: 'Tom', avatar: 'https://joeschmoe.io/api/v1/random' },
        { id: 2, name: 'Jerry', avatar: 'https://joeschmoe.io/api/v1/random' },
    ];

    const applications = [
        { id: 1, name: 'Spike', avatar: 'https://joeschmoe.io/api/v1/random', status: '待审核' },
        { id: 2, name: 'Tyke', avatar: 'https://joeschmoe.io/api/v1/random', status: '已同意' },
    ];

    const applied = [
        { id: 1, name: 'Butch', avatar: 'https://joeschmoe.io/api/v1/random', status: '待对方确认' },
        { id: 2, name: 'Nibbles', avatar: 'https://joeschmoe.io/api/v1/random', status: '已拒绝' },
    ];



    return (
        <Tabs items={items} />
    );
};*/

const Friend = () => {

    const onChange = (key) => {
        console.log(key)
    }

    const data = () => {
        const arr = []
        for (let i = 0; i < 30; i++) {
            arr.push({avatarIndex:i,title:'title index' + i,desc:'desc index' + i})
        }

        return arr;
    }

    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: '1',
            children: (
                <ChatList data={data()} pageSize={6} renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.avatarIndex}`} />}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={item.desc}
                        />
                       <Space>
                           <Button>删除</Button>
                           <Button>发送信息</Button>
                       </Space>
                    </List.Item>
                )}/>
            ),
        },
        {
            label: '申请列表',
            key: '2',
            children:(<div>申请列表</div>),
        },
        {
            label: '待处理好友申请',
            key: '3',
            children: (<div>待处理好友申请</div>),
        },
    ];



    return (
        <ChatTable onChange={onChange} items={items} />
    )
}

export default Friend


