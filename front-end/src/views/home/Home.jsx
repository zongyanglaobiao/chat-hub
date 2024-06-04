import {friendListInfoThunk} from "@/redux/feature/friend.thunk.js";
import {userInfoThunk} from "@/redux/feature/user.thunk.js";
import {Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {memo, useCallback, useEffect} from "react";
import {HOME_CHAT, HOME_FRIEND, HOME_PERSON_SETTING, LOGIN} from "@/router/index.jsx";
import Message from '@/assets/message.svg'
import Dialogue from '@/assets/dialogue.svg'
import Friend from '@/assets/friends.svg'
import {Avatar, Dropdown} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {removeToken} from "@/http/http.request.js";
import {AUTHORIZE_FAIL, authorizeAction} from "@/redux/feature/authorize.js";
import {groupInfoThunk} from "@/redux/feature/group.thunk.js";

function init(dispatch) {
    dispatch(userInfoThunk())
    dispatch(friendListInfoThunk())
    dispatch(groupInfoThunk())
}

const Home = memo(() => {
    const authorize = useSelector(state => state.authorize)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        //存在token则不判断
        if (!authorize) {
            navigate(LOGIN);
            return
        }

        //加载用户信息、朋友列表信息
        init(dispatch)
    }, [authorize, dispatch, navigate]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 w-full">
            <ChatHeader/>
            <div className="layout-center w-full h-full">
                <div className="flex w-[70%] h-500px bg-white rounded-2xl p-2">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
})

const ChatHeader = memo(() => {
    const navigate = useNavigate();
    let user = useSelector(state => state.userInfo);
    const dispatch = useDispatch();

    const signOut = useCallback(() => {
        //移除TOKEN
        removeToken()
        //授权状态改为未授权
        dispatch(authorizeAction(AUTHORIZE_FAIL))
        navigate(LOGIN)
    }, [navigate, dispatch]);

    const personSetting = useCallback(() => {
        navigate(HOME_PERSON_SETTING)
    }, [navigate]);

    const items = [
        { key: '1', label: (<div onClick={personSetting}>个人设置</div>) },
        { key: '2', label: (<div onClick={signOut}>退出登录</div>) },
    ]

    return (
        <header className="flex justify-between items-center p-4  bg-white shadow h-[5%] ">
            <div className="w-[50%] flex justify-between">
                <div className='flex items-center'>
                    <img src={Message} alt="message" className="w-[50px]"/>
                    <h1 className="text-xl font-bold ml-2px">Chat Hub</h1>
                </div>
                <div className='flex items-center cursor-pointer' onClick={() => navigate(HOME_CHAT)}>
                    <img src={Dialogue} alt="chat" className="w-[20px]"/>
                    <span>首页</span>
                </div>
                <div className='flex items-center cursor-pointer' onClick={() => navigate(HOME_FRIEND)}>
                    <img src={Friend} alt="friends" className="w-[20px]"/>
                    <span>我的好友</span>
                </div>
                {/*<div className='flex items-center cursor-pointer' onClick={() => navigate({pathname:HOME_GROUP,hash:IS_JUMP})}>
                    <img src={GroupChat} alt="groupChat" className="w-[20px]"/>
                    <span>我的群聊</span>
                </div>*/}
            </div>
            <div className="flex items-center mr-5">
                <span className="mr-3">{user.nickname}</span>
                <Avatar className="mr-3" size={50} src={user.avatar}>
                </Avatar>
                {/* 下拉菜单按钮图标 */}
                <Dropdown
                    menu={{items}}>
                    <a onClick={(e) => e.preventDefault()}>
                        <DownOutlined/>
                    </a>
                </Dropdown>
            </div>
        </header>
    );
})
export default Home;