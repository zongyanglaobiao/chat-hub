import {LeftCircleTwoTone} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {doGetInfo} from "@/http/api/user.api.js";
import {useEffect} from "react";
import {useFetch} from "@/hook/useFetch.jsx";
import {Avatar} from "antd";

/**
 *  用户展示群/用户信息的页面
 */
const SHOW_GROUP = "group";
const SHOW_USER = "user";

const Info = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {showType,sourcePath,id} = location.state

    return (
        <div>
            <header>
                <LeftCircleTwoTone style={{fontSize:30}} onClick={() =>  navigate(sourcePath)}/>
            </header>
            <main>
                {
                    showType === SHOW_GROUP && <GroupInfo/>
                    ||
                    showType === SHOW_USER && <UserInfo userId={id}/>
                }
            </main>
        </div>
    )
}

const GroupInfo = ({groupId}) => {
    return (
        <div>群</div>
    )
}

const UserInfo = ({userId}) => {
    const {response,setRequestMethodParam} = useFetch(null,doGetInfo)

    console.log('response',response)

    useEffect(() => {
        setRequestMethodParam(userId)
    }, [userId]);

    return (
        <div>
            <Avatar src={response?.data?.avatar}/>
        </div>
    )
}


export default Info
export {SHOW_GROUP,SHOW_USER}