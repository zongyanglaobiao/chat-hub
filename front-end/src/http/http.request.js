import axios from "axios";
import {message} from "antd";
import {storeTokenAction} from "@/redux/feature/token.js";
import {store} from "@/redux/store.js";

const URL = import.meta.env.VITE_REACT_APP_PATH
const TOKEN_NAME = "auth";
const TOKEN_FAIL = "TOKEN";

const getToken = () => {
	return localStorage.getItem(TOKEN_NAME)
}

const setToken = (token) => {
	localStorage.setItem(TOKEN_NAME, token)
}

const removeToken = () => {
	localStorage.removeItem(TOKEN_NAME)
}

// 创建 axios 请求实例
const serviceAxios = axios.create({
	baseURL:URL, // 基础请求地址
	timeout: 10000, // 请求超时设置
	withCredentials: false, // 跨域请求是否需要携带 cookie
});

// 创建请求拦截
serviceAxios.interceptors.request.use(
	(config) => {
		config.headers = {'Content-Type': 'application/json',...config.headers,[TOKEN_NAME]:getToken()};
		//Post是data
		//get是params
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);


// 创建响应拦截
serviceAxios.interceptors.response.use(
	(res) => {
		if (res.data.code === 500 && res.data.message.indexOf(TOKEN_FAIL) !== -1) {
			message.error(res.data.message);
			//移除之前的token
			removeToken()
		}

		//通知所有组件进行更新
		store.dispatch(storeTokenAction(getToken()))
		return res.data;
	},
	(error) => {
		let message = "";
		if (error && error.response) {
			switch (error.response.status) {
				case 302:
					message = "接口重定向了！";
					break;
				case 400:
					message = "参数不正确！";
					break;
				case 401:
					message = "您未登录，或者登录已经超时，请先登录！";
					break;
				case 403:
					message = "您没有权限操作！";
					break;
				case 404:
					message = `请求地址出错: ${error.response.config.url}`;
					break;
				case 408:
					message = "请求超时！";
					break;
				case 409:
					message = "系统已存在相同数据！";
					break;
				case 500:
					message = "服务器内部错误！";
					break;
				case 501:
					message = "服务未实现！";
					break;
				case 502:
					message = "网关错误！";
					break;
				case 503:
					message = "服务不可用！";
					break;
				case 504:
					message = "服务暂时无法访问，请稍后再试！";
					break;
				case 505:
					message = "HTTP 版本不受支持！";
					break;
				default:
					message = "异常问题，请联系管理员！";
					break;
			}
		}
		//http错误进行提醒
		message.endsWith(message)
		return Promise.reject(message);
	}
);

const request = {
	post:(url,data = {}) => {
		return serviceAxios({
			url: url,
			method: "post",
			data: data,
			headers: {
				"Content-Type": "application/json"
			}
		})
	},
	get:(url,params = {})=>{
		return serviceAxios({
			url: url,
			method: "get",
			params: params,
			headers: {
				"Content-Type": "application/json"
			}
		})
	}
}

export {getToken, setToken, removeToken,URL}

export default request;
