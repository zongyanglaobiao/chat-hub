import {lazy} from "react";

export const LOGIN = "/login"
export const ROOT = "/";
export const HOME = "/home"
export const HOME_PERSON_SETTING = "/home/person"

const Home = lazy(()=> import('@/views/home/Home.jsx'))
const NotFound = lazy(() => import('@/component/404/NotFound.jsx'))
const Login = lazy(() => import('@/views/login/Login.jsx'))
const PersonSetting = lazy(() => import('@/views/home/setting/PersonSetting.jsx'))

export default function routes() {
    return [
        {
            path: HOME,
            element: <Home/>,
            children: [
                {
                    path: HOME_PERSON_SETTING,
                    element: <PersonSetting/>
                },
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
