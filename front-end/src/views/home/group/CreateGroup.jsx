import {useLocation, useNavigate} from "react-router-dom";
import {memo, useEffect} from "react";
import {Avatar, Button, Flex, Input, message, Upload} from "antd";
import {getUploadUrl} from "@/http/api/file.api.js";
import {getToken} from "@/http/http.request.js";
import {AntDesignOutlined, UploadOutlined} from "@ant-design/icons";

const CreateGroup = memo(() => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(location);
    }, [location]);

    const props = {
        name: 'file',
        action: getUploadUrl(),
        headers: {
            authorization: getToken(),
        },
        onChange(info) {
            console.log(info)
            if (info.file.response.code === 200) {
                message.success(`${info.file.name} 上传成功`);
            } else {
                message.error(`文件上传失败: ${info.file.response.message}`);
            }
        },
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <Flex justify={"center"} vertical>
                <Avatar size={80}
                        icon={<AntDesignOutlined />}
                        shape={"square"}
                        src={'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'} />
                <Upload {...props} className=' cursor-pointer'>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Input placeholder="请输入群组名称"/>
                <Flex>
                    <Button type={"primary"}>
                        保存
                    </Button>
                    <Button type={"primary"}>
                        返回
                    </Button>
                </Flex>
            </Flex>
        </div>
    )
})


export default CreateGroup