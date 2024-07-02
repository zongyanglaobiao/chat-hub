import {List} from "antd";
import {useState} from "react";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";

export const ChatList = (props) => {
    const {data,renderItem,pageSize ,current} = props
    const [curr, setCurr] = useState(isNullOrUndefined(current) ? 1 : current)

    return (
        <List
            {...props}
            itemLayout="horizontal"
            dataSource={data}
            pagination={{
                onChange: (page) => {
                    setCurr(page)
                },
                position:"bottom",
                align:"center",
                pageSize:isNullOrUndefined(pageSize) ? 5 : pageSize,
                current:curr
            }}
            renderItem={renderItem}
        />
    )
}