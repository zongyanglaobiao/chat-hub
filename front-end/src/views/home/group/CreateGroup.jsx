import {useLocation, useNavigate} from "react-router-dom";
import {memo, useEffect, useRef, useState} from "react";
import {Avatar, Button, Divider, Flex, Input, List, message, Modal, Space, Typography, Upload} from "antd";
import {getUploadUrl} from "@/http/api/file.api.js";
import {getToken} from "@/http/http.request.js";
import {LeftCircleTwoTone, UploadOutlined} from "@ant-design/icons";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {useFetch} from "@/hook/useFetch.jsx";
import {doCreateOrModify} from "@/http/api/group.info.api.js";
import {ChatList} from "@/component/list/ChatList.jsx";
import {useSelector} from "react-redux";
import {doQueryUserInfos} from "@/http/api/user.api.js";

const { Title } = Typography;

const CreateGroup = memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const [groupInfo, setGroupInfo] = useState({id:null,groupName:null,avatar:null,members:[]})
    const [doCreateOrModifyResp,doCreateOrModifyProxy] = useFetch(doCreateOrModify)
    const [selectMembers, setGetSelectMembers] = useState([])

    useEffect(() => {
        const {groupInfo} = location.state
        !isNullOrUndefined(groupInfo) && setGroupInfo(groupInfo)
    }, [location]);

    useEffect(() => {
        !isNullOrUndefined(doCreateOrModifyResp) &&
        (
            doCreateOrModifyResp.code !== 200 && message.error(doCreateOrModifyResp.message) ||
            doCreateOrModifyResp.code === 200 && message.success("保存成功")
        )
    }, [doCreateOrModifyResp]);

    useEffect(() => {
        setGroupInfo(prevState => ({...prevState,members:[...selectMembers.map(t => ({userId:t.id}))]}))
    }, [selectMembers]);

    useEffect(() => {
        console.log(selectMembers)
    });

    const updateGroupInfo = (groupName,avatar) => {
        setGroupInfo(prev => {
            groupName = groupName || prev.groupName
            avatar = avatar || prev.avatar
            console.log([...(selectMembers.map(t => ({userId:t.id})))])
            return  {...prev,groupName,avatar}
        })
    }

    const props = {
        name: 'file',
        action: getUploadUrl(),
        headers: {
            auth: getToken(),
        },
        onChange(info) {
            if (!info.file?.response) {
                return
            }

            if (info.file.response.code === 200) {
                updateGroupInfo(null,info.file.response.data)
                message.success(`${info.file.name} 上传成功`);
            } else {
                message.error(`文件上传失败: ${info.file.response.message}`);
            }
        },
    };

    return (
        <div className="p-4 flex w-full flex-row items-center">
            <Flex justify={"center"} className='w-1/3' vertical gap={'small'}>
                <LeftCircleTwoTone style={{fontSize:30}}/>

                {
                    !isNullOrUndefined(groupInfo.avatar) &&
                    <Avatar size={240}
                            shape={"square"}
                            src={groupInfo.avatar} />
                }
                <Upload {...props} className=' cursor-pointer'>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Input placeholder="请输入群组名称"
                       onChange={e => updateGroupInfo(e.target.value,null)}/>
                <Flex>
                    <Space >
                        <Button
                            onClick={()=>navigate(location.state.from)}
                            type={"primary"}>
                            返回
                        </Button>
                        <Button
                            onClick={() => {
                                doCreateOrModifyProxy(groupInfo)
                            }}
                            type={"primary"}>
                            保存
                        </Button>
                    </Space>
                </Flex>
            </Flex>
            <Divider type={"vertical"} className='h-full'/>
            <ChatList className="w-full"
                      bordered={true}
                      header={(
                          <Flex justify={"space-between"} align={"center"}>
                              <Title level={3}>群组成员</Title>
                              <SelectMember getSelectMembers={setGetSelectMembers}/>
                          </Flex>
                      )}
                      data={selectMembers}
                      renderItem={item => {
                          return (
                              <List.Item className="">
                                  <List.Item.Meta
                                      avatar={<Avatar shape={"square"} size={50} src={item.avatar} />}
                                      title={item.nickname}
                                      description={<p className='text-overflow'>{item.signature}</p>}
                                  />
                              </List.Item>
                          )
                      }}/>
        </div>
    )
})

const SelectMember = memo(({getSelectMembers}) => {
    const [open, setOpen] = useState(false);
    const {friendList} = useSelector(state => state.friendInfo)
    const [doQueryUserInfosResp,doQueryUserInfosProxy] = useFetch(doQueryUserInfos)
    const [friendInfos, setFriendInfos] = useState([])
    const selectMemberRef = useRef([])
    const [disable, setDisable] = useState([])
    const userInfo = useSelector(state => state.userInfo)

    useEffect(() => {
        !isNullOrUndefined(doQueryUserInfosResp) && setFriendInfos(doQueryUserInfosResp.data)
    }, [doQueryUserInfosResp]);


    useEffect(() => {
        friendList.length > 0 && doQueryUserInfosProxy(friendList.map(t => t.friendId))
    }, [friendList]);

    const handleOk = () => {
        getSelectMembers([...selectMemberRef.current,userInfo])
        setOpen(false);
    };

    return (
        <>
            <Button onClick={()=>setOpen(true)}>
                选择成员
            </Button>
            <Modal
                title="Title"
                open={open}
                onOk={handleOk}
                onCancel={()=>setOpen(false)}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={friendInfos}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar size={"large"} src={item.avatar}/>}
                                title={<p>{item.nickname}</p>}
                            />
                            {
                                isNullOrUndefined(disable.find(t => t === item.id)) ?
                                    <Button  onClick={()=>{
                                        selectMemberRef.current.push(item)
                                        setDisable(prevState => [...prevState,item.id])
                                    }}>
                                        添加
                                    </Button>
                                    :
                                    <Button danger onClick={()=>{
                                        selectMemberRef.current = selectMemberRef.current.filter(t => t.id !== item.id)
                                        setDisable(prevState => prevState.filter(t => t !== item.id))
                                    }}>
                                        删除
                                    </Button>
                            }
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    )
})


export default CreateGroup