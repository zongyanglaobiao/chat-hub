import {friendListInfoThunk} from "@/redux/feature/friend.thunk.js";
import {userInfoThunk} from "@/redux/feature/user.thunk.js";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect} from "react";
import {isBlank} from "@/lib/toolkit/util.js";
import {HOME_PERSON_SETTING, LOGIN} from "@/router/index.jsx";
import {TOKEN_NAME} from "@/http/http.request.js";
import MessageSVG from '@/assets/message.svg'
import {Avatar, Dropdown} from "antd";
import {DownOutlined} from "@ant-design/icons";

const IS_JUMP = 'false';

function init(dispatch) {
    dispatch(friendListInfoThunk())
    dispatch(userInfoThunk())
}

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (location.hash.indexOf(IS_JUMP) === -1) {
            //todo navigate(HOME_ROUTE + HOME_CHAT)
        }

        const auth = localStorage.getItem(TOKEN_NAME);
        //存在token则不判断
        if (isBlank(auth)) {
            navigate(LOGIN);
            return
        }

        //加载用户信息、朋友列表信息
        init(dispatch)
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <ChatHeader/>
            <div className="layout-center w-full h-full">
                <div className="flex w-[60%] h-[85%] bg-white rounded-2xl p-2">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

const ChatHeader = () => {
    const navigate = useNavigate();
    let user = useSelector(state => state.userInfo);

    const signOut = useCallback((event) => {
        localStorage.removeItem(TOKEN_NAME)
        navigate(LOGIN)
    }, []);

    const personSetting = useCallback((event) => {
        navigate({pathname:HOME_PERSON_SETTING,hash:IS_JUMP})
    }, []);

    const items = [
        { key: '1', label: (<div onClick={personSetting}>个人设置</div>) },
        { key: '2', label: (<div onClick={signOut}>退出登录</div>) },
    ]

    return (
        <header className="flex justify-between items-center p-4  bg-white shadow h-[5%]">
            <div className="w-[50%] flex justify-between">
                <div className='flex items-center'>
                    <img src={MessageSVG} alt="message" className="w-[50px]"/>
                    <h1 className="text-xl font-bold">Secure Chat Hub</h1>
                </div>
               {/* <div className='flex items-center cursor-pointer' onClick={() => navigate({pathname:HOME_CHAT,hash:IS_JUMP})}>
                    <img src={DIALOGUE} alt="chat" className="w-[20px]"/>
                    <span>首页</span>
                </div>
                <div className='flex items-center cursor-pointer' onClick={() => navigate({pathname:HOME_FRIEND,hash:IS_JUMP})}>
                    <img src={FriendsSVG} alt="friends" className="w-[20px]"/>
                    <span>我的好友</span>
                </div>
                <div className='flex items-center cursor-pointer' onClick={() => navigate({pathname:HOME_GROUP,hash:IS_JUMP})}>
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
};

export default Home;
