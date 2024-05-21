import {SearchOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Input, List, Select, Space} from "antd";

const { Search } = Input;

function SearchPage() {
    //找到来这页面的路由
    const location = useLocation();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => {
        setList([{id:1,name:'xxxx'},{id:2,name:'xxxx'}])
    }, []);

    const options = [
        {label: '所有', value: 'ALL'},
        {label: '用户', value: 'USER'},
        {label: '朋友', value: 'FRIEND'},
        {label: '群', value: 'GROUP'},
    ]

    return (
        <div className=' w-full text-center relative'>
            <header className='relative top-20px'>
               <Space>
                   <Button
                       shape="circle"
                       onClick={() =>  {
                           console.log('点击')
                           navigate(location.state)
                       }}
                       icon={ <SearchOutlined /> }
                   >
                   </Button>
                   <Search placeholder="input search text"
                           onSearch={(value)=> {
                               console.log(value)
                           }}
                           enterButton />
                   <Select
                       defaultValue="所有"
                       options={options}
                       style={{
                           width: 120,
                       }}
                       onChange={(value, option)=>{
                           console.log(value,option)
                       }}/>
               </Space>
            </header>
            <main>
                <div className="overflow-auto max-h-80">
                    <List
                        loadMore = {(
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: 12,
                                    height: 32,
                                    lineHeight: '32px',
                                }}
                            >
                                <Button onClick={()=>{
                                    setList([...list,{id:3,name:'xxxx'}])
                                }}>loading more</Button>
                            </div>
                        )}
                        dataSource={list}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                {item.name}
                            </List.Item>
                        )}
                    />
                </div>
            </main>
        </div>
    )
}


export default SearchPage;