import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {isBlank} from "@/lib/toolkit/util.js";
import {TOKEN_NAME} from "@/http/http.request.js";
import {HOME} from "@/router/index.jsx";
import {message} from "antd";
import {doLogin, doRegister} from "@/http/api/user.api.js";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem(TOKEN_NAME);
        //存在token则不判断
        if (!isBlank(auth)) {
            //跳转到首页
            navigate(HOME);
        }
    }, [navigate]);


    const [isLogin, setLogin] = useState(true)
    return (
        <div className='w-full h-[100vh] layout-center'>
            {
                isLogin ? <LoginPage setLogin={setLogin}/> :  <RegisterPage setLogin={setLogin}/>
            }
        </div>
    )
}


const LoginPage = ({setLogin}) => {
    const mail = useRef();
    const pwd = useRef();
    const navigate = useNavigate();

    const login = useCallback( async (event) => {
        event.preventDefault();
        const resp = await doLogin({mail: mail.current.value,password:pwd.current.value});
        const code = resp.code;
        if (code === 500) {
            message.error(resp.message)
            return
        }

        if (code === 200) {
            localStorage.setItem(TOKEN_NAME, resp.data.token);
            navigate(HOME)
        }
    }, []);

    return (
        <div>
            <div className="max-w-md relative flex flex-col p-4 rounded-md text-black bg-white">
                <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">Welcome back to ChatHub<span
                    className="text-[#7747ff]">App</span></div>
                <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">Log in to your account</div>
                <form className="flex flex-col gap-3" action="">
                    <div className="block relative">
                        <label htmlFor="email"
                               className="block  text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Email</label>
                        <input type="text" ref={mail} id="mail"
                               className="h-[20px] ounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"/>

                    </div>
                    <div className="block relative">
                        <label htmlFor="password"
                               className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Password</label>
                        <input type="password" ref={pwd} id="password"
                               className="h-[20px] rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block  m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"/>

                    </div>
                    <div className='flex'>
                        <button type="button"
                                className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
                                onClick={login}>
                            登录
                        </button>
                        <button
                            onClick={()=>{
                                setLogin(false)
                            }}
                            type="button"
                            className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal">
                            注册
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const RegisterPage = ({setLogin}) => {
    const mail = useRef();
    const pwd = useRef();
    const nickname = useRef();
    const gender = useRef()

    const registerHandler = useCallback( async () => {
        const registerDto = {
            mail: mail.current.value,
            password: pwd.current.value,
            nickname: nickname.current.value,
            gender: gender.current.value
        }
        const resp = await doRegister(registerDto);
        const code = resp.code;
        if (code === 500) {
            message.error(resp.message)
            return
        }

        if (code === 200) {
            message.success("注册成功")
            setLogin(true)
        }
    }, []);

    return (
        <div>
            <div>
                <div className="max-w-md relative flex flex-col p-4 rounded-md text-black bg-white">
                    <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">Welcome back to ChatHub<span
                        className="text-[#7747ff]">App</span></div>
                    <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">register your account</div>
                    <form className="flex flex-col gap-3" action="">
                        <div className="block relative">
                            <label htmlFor="mail"
                                   className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">邮箱</label>
                            <input
                                ref={mail}
                                type="text" id="email"
                                   className=" rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-[20px] m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"/>
                        </div>
                        <div className="block relative">
                            <label htmlFor="password"
                                   className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">密码</label>
                            <input type="password" id="password"
                                   ref={pwd}
                                   className=" rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-[20px] m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"/>

                        </div>
                        <div className="block relative">
                            <label htmlFor="gender"
                                   className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">性别</label>
                            <input
                                ref={gender}
                                type="text" id="gender"
                                   className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-[20px] m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"/>
                        </div>
                        <div className="block relative">
                            <label htmlFor="nickname"
                                   className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">昵称</label>
                            <input
                                ref={nickname}
                                type="text" id="nickname"
                                   className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-[20px] m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"/>
                        </div>
                        <div className='flex'>
                            <button
                                onClick={() => {
                                    setLogin(true)
                                }}
                                type="button"
                                className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal">
                                登录
                            </button>
                            <button
                                type="button"
                                className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
                                onClick={registerHandler}>
                                注册
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login