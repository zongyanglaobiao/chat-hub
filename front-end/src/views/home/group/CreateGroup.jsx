import {useLocation, useNavigate} from "react-router-dom";
import {memo, useEffect, useRef, useState} from "react";
import {Avatar, Button, Flex, Input, message, Space, Upload} from "antd";
import {getUploadUrl} from "@/http/api/file.api.js";
import {getToken} from "@/http/http.request.js";
import {UploadOutlined} from "@ant-design/icons";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {useFetch} from "@/hook/useFetch.jsx";
import {doCreateOrModify} from "@/http/api/group.info.api.js";

const CreateGroup = memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const [groupInfo, setGroupInfo] = useState({id:null,groupName:null,avatar:null})
    const [doCreateOrModifyResp,doCreateOrModifyProxy] = useFetch(doCreateOrModify)

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

    const updateGroupInfo = (groupName,avatar) => {
        setGroupInfo((prev) => {
            groupName = groupName || prev.groupName
            avatar = avatar || prev.avatar
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

    useEffect(() => {
        console.log(doCreateOrModifyResp)
    });

    return (
        <div className="p-4 flex flex-col items-center">
            <Flex justify={"center"} vertical gap={'small'}>
                {
                    !isNullOrUndefined(groupInfo.avatar) &&
                    <Avatar size={140}
                            shape={"square"}
                            src={groupInfo.avatar} />
                }
                <Upload {...props} className=' cursor-pointer'>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Input placeholder="请输入群组名称"
                       onChange={e => updateGroupInfo(e.target.value,null)}/>
                <Flex>
                    <Space>
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
        </div>
    )
})


export default CreateGroup