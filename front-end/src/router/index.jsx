import {lazy} from "react";

export const LOGIN = "/login"
export const ROOT = "/";
export const HOME = "/home"
export const HOME_PERSON_SETTING = "/home/person"
export const HOME_CHAT = "/home/chat"
export const HOME_CHAT_SEARCH = "/home/chat/search"
export const HOME_CHAT_WINDOW = "/home/chat/window"
export const HOME_FRIEND = "/home/friend"
export const HOME_INFO = "/home/info"

const Home = lazy(()=> import('@/views/home/Home.jsx'))
const NotFound = lazy(() => import('@/component/404/NotFound.jsx'))
const Login = lazy(() => import('@/views/login/Login.jsx'))
const PersonSetting = lazy(() => import('@/views/home/setting/PersonSetting.jsx'))
const Chat = lazy(() => import('@/views/home/chat/Chat.jsx'))
const ChatWindow = lazy(() => import('@/views/home/chat/window/ChatWindow.jsx'))
const ChatSearch = lazy(() => import('@/views/home/chat/search/Search.jsx'))
const Friend = lazy(() => import('@/views/home/friend/Friend.jsx'))
const Info = lazy(() => import('@/views/home/info/Info.jsx'))

export default function routes() {
    return [
        {
            path: HOME,
            element: <Home/>,
            children: [
                {
                    //现在这个路径可以加上父路由的路径
                    path: HOME_PERSON_SETTING,
                    element: <PersonSetting/>
                },
                {
                    path:HOME_CHAT,
                    element: <Chat/>,
                    children: [
                        {
                            path:HOME_CHAT_WINDOW,
                            element:<ChatWindow/>
                        },
                        {
                            path:HOME_CHAT_SEARCH,
                            element:<ChatSearch/>
                        }
                    ]
                },
                {
                    path:HOME_INFO,
                    element:<Info/>
                },
                {
                    path: HOME_FRIEND,
                    element: <Friend/>
                }
            ]
        },
        {
            path: LOGIN,
            element: <Login/>
        },
        {
            path: "*",
            element: <NotFound/>
        },
        {
            path:ROOT,
            element: <Login/>
        }
    ];
}
