import {List} from "antd";
import {useState} from "react";

export const ChatList = ({data,renderItem,pageSize = 5,current = 1}) => {
    const [curr, setCurr] = useState(current)

    return (
        <List
            itemLayout="horizontal"
            dataSource={data}
            pagination={{
                onChange: (page) => {
                    setCurr(page)
                },
                position:"bottom",
                align:"center",
                pageSize:pageSize,
                current:curr
            }}
            renderItem={renderItem}
        />
    )
}