import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Input, List, Select, Space} from "antd";
import {LeftCircleTwoTone} from "@ant-design/icons";

const { Search } = Input;

function SearchPage() {
    //找到来这页面的路由
    const location = useLocation();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => {
        const arr =[]
        for (let i = 0; i < 10; i++) {
             arr.push({ id: i, name: `测试${i}`})
        }
        setList(arr);
    },[]);

    const options = [
        {label: '所有', value: 'ALL'},
        {label: '用户', value: 'USER'},
        {label: '朋友', value: 'FRIEND'},
        {label: '群', value: 'GROUP'},
    ]

    return (
        <div className=' w-full text-center relative'>
            <header className='relative top-15px mb-20px'>
               <Space>
                   <LeftCircleTwoTone style={{fontSize:30}} onClick={() =>  navigate(location.state)}/>
                   <Search placeholder="input search text"
                           onSearch={(value)=> {
                               console.log(value)
                           }}
                           enterButton />
                   <Select
                       defaultValue="所有"
                       options={options}
                       style={{
                           width: 80,
                       }}
                       onChange={(value, option)=>{
                           console.log(value,option)
                       }}/>
               </Space>
            </header>
            <main className='p5px'>
                <div className="scroll-y-style max-h-100">
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