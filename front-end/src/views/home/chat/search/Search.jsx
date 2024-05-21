import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Input, List, message, Select, Space} from "antd";
import {LeftCircleTwoTone} from "@ant-design/icons";
import {doSearch} from "@/http/api/common.api.js";

const { Search } = Input;

const SEARCH_TYPES = [
    {label: '所有', value: 'ALL'},
    {label: '用户', value: 'USER'},
    {label: '朋友', value: 'FRIEND'},
    {label: '群', value: 'GROUP'},
]


function SearchPage() {
    //找到来这页面的路由
    const location = useLocation();
    const navigate = useNavigate();
    //搜索改为数据同步渲染
    const [searchType, setSearchType] = useState(SEARCH_TYPES[0].value)
    const [keyword, setKeyword] = useState('')

    const search = useMemo( async (current = 1, size = 10) => {
        const resp =  await doSearch({searchType: searchType, keyword: keyword}, current, size);
        if (resp.code !== 200) {
            message.error(resp.message);
            return
        }
         return  resp.data
    }, [searchType, keyword]);

    //跳转过来时搜索
    useEffect(() => {
        //去除传递参数中的?
        setKeyword(location.search.slice(1))
    }, [location.search]);

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
                       defaultValue={SEARCH_TYPES[0].label}
                       options={SEARCH_TYPES}
                       style={{
                           width: 80,
                       }}
                       onChange={(value)=> setSearchType(value)}/>
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
                                    message.warning("没有更多啦")
                                }}>loading more</Button>
                            </div>
                        )}
                        dataSource={[{id:1,name:"1"},{id:2,name:"2"}]}
                        renderItem={item => {
                            const searchResult = search();
                            console.log('searchResult', searchResult);
                            return (
                                <List.Item key={item.id}>
                                    {item.name}
                                </List.Item>
                            )
                        }}
                    />
                </div>
            </main>
        </div>
    )
}



export default SearchPage;