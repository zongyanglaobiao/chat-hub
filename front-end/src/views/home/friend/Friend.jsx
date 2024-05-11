import {Avatar, Divider, List, Tabs} from "antd";
import {useSelector} from "react-redux";

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

export const Friend_ = () => {
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

    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: '1',
            children: RenderTabContent(friends),
        },
        {
            label: '申请列表',
            key: '2',
            children: RenderTabContent(applications, true),
        },
        {
            label: '被申请列表',
            key: '3',
            children: RenderTabContent(applied, true),
        },
    ];

    return (
        <Tabs items={items} />
    );
};

const Friend = () => {
    return (
        <div>
            好友列表
        </div>
    )
}

export default Friend


