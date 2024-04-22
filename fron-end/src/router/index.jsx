import {lazy} from "react";

export const LOGIN = "/login"
export const ROOT = "/";
export const HOME = "/home"
export const HOME_PERSON_SETTING = "/home/person"
export const HOME_CHAT = "/home/chat"

const Home = lazy(()=> import('@/views/home/Home.jsx'))
const NotFound = lazy(() => import('@/component/404/NotFound.jsx'))
const Login = lazy(() => import('@/views/login/Login.jsx'))
const PersonSetting = lazy(() => import('@/views/home/setting/PersonSetting.jsx'))
const Chat = lazy(() => import('@/views/home/chat/window/ChatWindow.jsx'))

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
                    element: <Chat/>
                }
               /* {
                    path: HOME_FRIEND,
                    element: <Friend/>
                },
                {
                    path: HOME_GROUP,
                    element: <ChatGroup/>
                },
                {
                    path: HOME_SETTING,
                    element: <PersonSetting/>
                }*/
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
