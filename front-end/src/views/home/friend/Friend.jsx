import {Avatar, Divider, Flex, List, Tabs} from "antd";
import {useSelector} from "react-redux";
import ChatTable from "@/component/table/ChatTable.jsx";
import {useEffect} from "react";

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
        for (let i = 0; i < 5; i++) {
            arr.push("desc =====" + i)
        }

        return arr;
    }

    // 使用items属性配置每个Tab页
    const items = [
        {
            label: '好友列表',
            key: '1',
            children: (
                <div className=" overflow-y-hidden">
                    <List
                        itemLayout="horizontal"
                        dataSource={data()}
                        pagination={{
                            position:"bottom",
                            align:"center",
                        }}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=1`} />}
                                    title={<a href="https://ant.design">{item}</a>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
                </div>
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


