import {useEffect} from "react";
import {LeftCircleTwoTone} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";

/**
 *  用户展示群/用户信息的页面
 */
const SHOW_GROUP = "group";
const SHOW_USER = "user";

const Info = ({id,type}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        //查询信息
    }, [id,type]);

    return (
        <div>
            <header>
                <LeftCircleTwoTone style={{fontSize:30}} onClick={() =>  navigate(location.state)}/>
            </header>
            <main>
                {
                    type === SHOW_GROUP && <GroupInfo/>
                    ||
                    type === SHOW_USER && <UserInfo/>
                }
            </main>
        </div>
    )
}

const GroupInfo = ({group}) => {
    return (
        <div>群</div>
    )
}

const UserInfo = ({user}) => {
    return (
        <div>用户</div>
    )
}


export default Info
export {SHOW_GROUP,SHOW_USER}