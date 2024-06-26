import {useLocation, useNavigate} from "react-router-dom";
import {memo, useEffect} from "react";
import {Avatar, Button, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {getUploadUrl} from "@/http/api/file.api.js";
import {getToken} from "@/http/http.request.js";

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
            if (info.file.response.code === 200) {
                message.success(`${info.file.name} 上传成功`);
            } else {
                message.error(`文件上传失败: ${info.response.message}`);
            }
        },
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <Avatar size={80} style={{backgroundColor:'#f56a00'}}
                    shape={"square"}
                    src={location.state?.groupInfo?.avatar ? location.state.groupInfo.avatar : ''}>
                G
            </Avatar>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
        </div>
    )
})


export default CreateGroup