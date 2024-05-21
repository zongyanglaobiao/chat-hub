import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Input, List, message, Select, Space} from "antd";
import {LeftCircleTwoTone} from "@ant-design/icons";
import {doSearch} from "@/http/api/common.api.js";
import {getRandomId, isBlank} from "@/lib/toolkit/util.js";

const { Search } = Input;

const SEARCH_TYPES = [
    {label: '所有', value: 'ALL'},
    {label: '用户', value: 'USER'},
    {label: '朋友', value: 'FRIEND'},
    {label: '群', value: 'GROUP'},
]

const  useSearch = () => {
    const [searchType, setSearchType] = useState(SEARCH_TYPES[0].value)
    const [keyword, setKeyword] = useState('')
    const searchResult = useRef({
        users:{record:[]},
        friends:{record:[]},
        groups:{record:[]},
    });

    useEffect(() => {
        (async ()=>{
            const resp =  await doSearch({searchType: searchType, keyword: keyword}, 1, 10);
            if (resp.code !== 200) {
                message.error(resp.message);
                return
            }
            searchResult.current = resp.data;
            console.log('自定义HOOK',searchResult)
        })()
    },[searchType, keyword]);


    return {
        searchResult,
        setSearchType,
        setKeyword
    }
}

function SearchPage() {
    //找到来这页面的路由
    const location = useLocation();
    const navigate = useNavigate();
    const {searchResult, setSearchType, setKeyword} = useSearch();

    /*//跳转过来时搜索
    useEffect(() => {
        //去除传递参数中的?
        setKeyword(location.search.slice(1))
    }, [location.search]);*/

    useEffect(() => {
        console.log('SearchPage',searchResult)
    });

    return (
        <div className=' w-full text-center relative'>
            <header className='relative top-15px mb-20px'>
               <Space>
                   <LeftCircleTwoTone style={{fontSize:30}} onClick={() =>  navigate(location.state)}/>
                   <Search placeholder="input search text"
                           onSearch={(value)=> {
                               if (isBlank(value)) {
                                   message.warning("搜索内容不能为空")
                                   return
                               }
                               setKeyword(value)
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
                    <div>朋友</div>
                    <List
                        dataSource={searchResult.current.friends?.records || []}
                        renderItem={item => {
                            console.log('searchResult', searchResult);
                            return (
                                <List.Item key={item.id}>
                                    {item.nickname}
                                </List.Item>
                            )
                        }}
                    />
                    {/*<div
                        style={{
                            textAlign: 'center',
                            marginTop: 12,
                            height: 32,
                            lineHeight: '32px',
                        }}
                    >
                        <Button onClick={() => {
                            message.warning("没有更多啦")
                        }}>loading more</Button>
                    </div>*/}
                </div>
            </main>
        </div>
    )
}


export default SearchPage;