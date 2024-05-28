import {useLocation, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {Avatar, Button, Input, List, message, Select, Space, Tag} from "antd";
import {LeftCircleTwoTone, UserOutlined} from "@ant-design/icons";
import {isBlank, isNullOrUndefined} from "@/lib/toolkit/util.js";
import {doSearch} from "@/http/api/common.api.js";
import {useSelector} from "react-redux";

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
                <ShowSearchContent
                    friends={searchResult.friends?.records || []}
                    groups={searchResult.groups?.records || []}
                    users={searchResult.users?.records || []}
                />
            </main>
        </div>
    )
}

const RESULT_USER_TYPE = "用户";
const RESULT_GROUP_TYPE = "群";

const ShowSearchContent = ({users,friends,groups}) => {
    const userInfo = useSelector(state => state.userInfo)
    const friendInfo = useSelector(state => state.friendInfo)

    //将数组中重复的项去重
    const uniqueArray = (array) =>{
        //对于ID重复的去重
        const newArr = [...new Set(array.map(item => item.id))]
        //查找ID重复的元素
        return newArr.map(id => array.find(item => item.id === id))
    }

    //合并users和friend
    let list = [
        ...uniqueArray([...users, ...friends]).map(t => ({...t,type:RESULT_USER_TYPE,name:t.nickname})),
        ...groups.map(t => ({...t,type:RESULT_GROUP_TYPE,name:t.groupName}))
    ];

    return (
        <div className='scroll-y-style max-h-100'>
            <List
                loadMore={(
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 12,
                            height: 32,
                            lineHeight: '32px',
                        }}
                    >
                        <Button onClick={() => {
                            message.info("暂时无数据")
                        }}>loading more</Button>
                    </div>
                )}
                dataSource={list}
                renderItem={item => {
                    return (
                        <div>
                            <List.Item key={item.id}  className='hover:cursor-pointer' onClick={()=>{

                            }}>
                                <div>
                                    <Avatar src={item.avatar} shape="square" size="large" icon={<UserOutlined/>}/>
                                </div>
                                <div className='text-overflow max-w-50px'>
                                    {item.name}
                                </div>
                                {item.type === RESULT_USER_TYPE && (
                                    <>
                                        <div className='text-overflow max-w-50px'>{item.mail}</div>
                                        <div className='text-overflow max-w-50px'>{item.signature}</div>
                                    </>
                                )}
                                {
                                    // 判断群里是否有我
                                    item.type === RESULT_GROUP_TYPE && (item.members.filter(t => userInfo.id === t.userId).length > 0 ? <Tag>你在群里</Tag> : <></>)
                                    ||
                                    //判断用户里是否为我好友
                                    item.type === RESULT_USER_TYPE && (friendInfo.friendList.filter(t => t.friendId === item.id).length > 0 ? <Tag>你是好友</Tag> : <></>)
                                }
                                <Tag color="blue">{item.type}</Tag>
                            </List.Item>
                        </div>
                    )
                }}
            />
        </div>
    )
}

export default SearchPage;

