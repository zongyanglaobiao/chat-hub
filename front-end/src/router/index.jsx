import {lazy, useEffect} from "react";
import {useLocation} from "react-router-dom";

export const LOGIN = "/login"
export const ROOT = "/";
export const HOME = "/home"
export const HOME_PERSON_SETTING = "/home/person"
export const HOME_CHAT = "/home/chat"
export const HOME_SEARCH = "/home/search"
export const HOME_FRIEND = "/home/friend"
export const HOME_GROUP_LIST = "/home/group/list"
export const HOME_CREATE_GROUP = "/home/group/create"

const Home = lazy(()=> import('@/views/home/Home.jsx'))
const NotFound = lazy(() => import('@/component/404/NotFound.jsx'))
const Login = lazy(() => import('@/views/login/Login.jsx'))
const PersonSetting = lazy(() => import('@/views/home/setting/PersonSetting.jsx'))
const Chat = lazy(() => import('@/views/home/chat/Chat.jsx'))
const Search = lazy(() => import('@/views/home/search/Search.jsx'))
const Friend = lazy(() => import('@/views/home/friend/Friend.jsx'))
const GroupList = lazy(() => import('@/views/home/group/GroupList.jsx'))
const CreateGroup = lazy(() => import('@/views/home/group/CreateGroup.jsx'))

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
                },
                {
                    path: HOME_FRIEND,
                    element: <Friend/>
                },
                {
                    path:HOME_SEARCH,
                    element:<Search/>
                },
                {
                    path:HOME_GROUP_LIST,
                    element:<GroupList/>
                },
                {
                    path:HOME_CREATE_GROUP,
                    element:<CreateGroup/>
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
