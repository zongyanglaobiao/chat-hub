import {Tabs} from "antd";

const initStyle = " w-full h-full ";

 const ChatTab = ({items,onChange = () => {},tabPosition = "left",size="small",className = initStyle}) => {
    return (
        <Tabs destroyInactiveTabPane={true}
              defaultActiveKey="1"
              tabPosition={tabPosition}
              items={items}
              onChange={onChange}
              rootClassName={className}
              size={size} />
    )
}

export default ChatTab