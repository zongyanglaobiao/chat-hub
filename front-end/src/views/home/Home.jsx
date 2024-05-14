import {friendListInfoThunk} from "@/redux/feature/friend.thunk.js";
import {userInfoThunk} from "@/redux/feature/user.thunk.js";
import {Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {memo, useCallback, useEffect} from "react";
import {isBlank} from "@/lib/toolkit/util.js";
import {HOME_CHAT_WINDOW, HOME_FRIEND, HOME_PERSON_SETTING, LOGIN} from "@/router/index.jsx";
import Message from '@/assets/message.svg'
import Dialogue from '@/assets/dialogue.svg'
import Friend from '@/assets/friends.svg'
import {Avatar, Dropdown} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {removeToken} from "@/redux/feature/token.js";

function init(dispatch) {
    dispatch(userInfoThunk())
    dispatch(friendListInfoThunk())
}

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(state => state.token)

    useEffect(()=>{
        console.log('Home render')
    })

    useEffect(() => {
        console.log('token', token,isBlank(token),typeof token,token === '')
        //存在token则不判断
        if (isBlank(token)) {
            navigate(LOGIN);
            return
        }

        //加载用户信息、朋友列表信息
        init(dispatch)
    }, [navigate]);

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
}

const ChatHeader = memo(() => {
    const navigate = useNavigate();
    let user = useSelector(state => state.userInfo);

    const signOut = useCallback(() => {
        //移除TOKEN
        removeToken()
        navigate(LOGIN)
    }, [navigate]);

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
                <div className='flex items-center cursor-pointer' onClick={() => navigate(HOME_CHAT_WINDOW)}>
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
