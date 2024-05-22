import {useLocation, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {Avatar, Button, Input, List, message, Select, Space} from "antd";
import {LeftCircleTwoTone, UserOutlined} from "@ant-design/icons";
import {isBlank, isNullOrUndefined} from "@/lib/toolkit/util.js";
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
    //搜素类型
    const searchType = useRef(SEARCH_TYPES[0].value)
    //搜索结果
    const [searchResult, setSearchResult] = useState({
        users:{records:[]},
        friends:{records:[]},
        groups:{records:[]},
    });

    const search = useCallback((searchType,keyword,size = 10,current = 1) => {
        (async ()=>{
            const resp =  await doSearch({searchType:searchType,keyword:keyword},current,size);
            if (resp.code !== 200) {
                message.error(resp.message);
                return
            }
            setSearchResult(resp.data)
        })()
    },[])

    //跳转过来时搜索
    useEffect(() => {
        if (isNullOrUndefined(location?.search)) {
            return
        }
        //去除传递参数中的?
        search(searchType.current,location.search.slice(1))
    }, [location.search, search]);

    useEffect(() => {
        console.log('SearchPage',searchResult,searchType)
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
                               search(searchType.current,value)
                           }}
                           enterButton />
                   <Select
                       defaultValue={SEARCH_TYPES[0].label}
                       options={SEARCH_TYPES}
                       style={{
                           width: 80,
                       }}
                       onChange={(value)=> searchType.current = value}/>
               </Space>
            </header>
            <main className='p5px'>
                <div className="scroll-y-style max-h-100">
                    <div>朋友</div>

                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 12,
                            height: 32,
                            lineHeight: '32px',
                        }}
                    >
                        <Button onClick={() => {
                            setSearchResult({users:{record:[]},friends:{record:[]},groups:{record:[]}});
                        }}>loading more</Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
const QUERY_USER_TYPE = 'USER'
const QUERY__TYPE = 'USER'
const ShowSearchContent = ({users,friends,groups}) => {
    //合并users和friend
    let list = [uniqueArray([...users, ...friends]).map(t => ({...t,type:'USER'})),...groups.map(t => ({...t,type:'GROUP'}))];
    switch (SEARCH_TYPES.map(t => t.value)) {
        case 'ALL':
            //取出重复的值
            usersList = ;
            break;
        case 'USER':
        case 'GROUP':
            groups = groups.map(t1 => ({...t1,name:t1.groupName}))
            usersList = [...users];
            break;
        case 'FRIEND':
            usersList = [...friends];
            break;
    }



    return (
        <div>
            <List
                dataSource={usersList}
                renderItem={item => {
                    return (
                        <List.Item key={item.id}>
                            <div>
                                {item.nickname}
                            </div>
                            <div>
                                <Avatar src={item.avatar} shape="square" size="large" icon={<UserOutlined/>}/>
                            </div>
                            <div>
                                可能是你认识的好友
                            </div>
                        </List.Item>
                    )
                }}
            />
        </div>
    )
}

const uniqueArray = (array) =>{
    array.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    return array;
}

export default SearchPage;

