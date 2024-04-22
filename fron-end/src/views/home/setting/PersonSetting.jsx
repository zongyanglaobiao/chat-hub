import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, Form, Input, message, Upload} from "antd";
import {useEffect, useRef, useState} from "react";
import {doModify} from "@/http/api/user.api.js";
import {userInfoThunk} from "@/redux/feature/user.thunk.js";
import {TOKEN_NAME} from "@/http/http.request.js";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";
import {UploadOutlined} from "@ant-design/icons";
import {getUploadUrl} from "@/http/api/file.api.js";


const PersonSetting = () => {
    const userInfo = useSelector(state => state.userInfo);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const downloadUrl = useRef();

    useEffect(() => {
        //重置表格的字段值否则更新之后它不会动
        form.resetFields()
    }, [userInfo]);

    const onEdit = () => {
        setEditing(true);
    };

    const onSave = async () => {
        setEditing(false);
        const params = {...form.getFieldsValue(),id:userInfo.id,avatar:downloadUrl.current};
        const resp = await doModify(params)

        if (resp.code === 200) {
            dispatch(userInfoThunk())
        } else {
            message.error(resp.message);
        }
    };

    const props = {
        name: 'file',
        action: getUploadUrl(),
        headers: {
            auth: localStorage.getItem(TOKEN_NAME),
        },
        onChange(info) {
            if (isNullOrUndefined(info.file.response)) {
                return
            }
            const {code} = info.file.response
            if (code === 200) {
                downloadUrl.current = info.file.response.message
                message.success("上传成功")
            } else {
                message.error(info.file.response.message);
            }
        },
        method: 'post',
    };

    return (
        <div className="flex items-center flex-row w-full h-full gap-5">
            <div className=" w-[40%] ml-25px">
                <Form
                    form={form} initialValues={{...userInfo}} layout="vertical">
                    <Form.Item label="昵称" name="nickname">
                        <Input disabled={!editing}/>
                    </Form.Item>
                    <Form.Item label="邮箱" name="mail">
                        <Input disabled={!editing}/>
                    </Form.Item>
                    <Form.Item label="性别" name="gender">
                        <Input disabled={!editing}/>
                    </Form.Item>
                    <Form.Item label="个性签名" name="signature">
                        <Input disabled={!editing}/>
                    </Form.Item>
                    <Form.Item label="IP 地址" name="ipAddress">
                        <Input disabled/>
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={onEdit} style={{marginRight: 8}}>
                    修改
                </Button>
                <Button type="primary" onClick={onSave} disabled={!editing}>
                    保存
                </Button>
            </div>
            <div className="flex flex-col items-center w-full">
                <Avatar size={200} src={userInfo.avatar}>
                </Avatar>
                <Upload
                    {...props}
                    disabled={!editing}
                         className="mt-4">
                    <Button icon={<UploadOutlined/>}  disabled={!editing}>更换头像</Button>
                </Upload>
            </div>
        </div>
    )
}

export default PersonSetting;
