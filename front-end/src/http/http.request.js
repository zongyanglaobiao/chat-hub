import axios from "axios";
import {store} from "@/redux/store.js";
import {message} from "antd";
import {AUTHORIZE_FAIL, authorizeAction} from "@/redux/feature/authorize.js";

const URL = import.meta.env.VITE_REACT_APP_PATH
const TOKEN_NAME = "auth";

const getToken = () => {
	return localStorage.getItem(TOKEN_NAME) || ''
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
		if (res.data.code === 403) {
			message.error(res.data.message);
			//移除之前的token
			removeToken()
			store.dispatch(authorizeAction(AUTHORIZE_FAIL))
		}
		return res.data;
	},
	(error) => {
		let msg = "";
		if (error && error.response) {
			switch (error.response.status) {
				case 302:
					msg = "接口重定向了！";
					break;
				case 400:
					msg = "参数不正确！";
					break;
				case 401:
					msg = "您未登录，或者登录已经超时，请先登录！";
					break;
				case 403:
					msg = "您没有权限操作！";
					break;
				case 404:
					msg = `请求地址出错: ${error.response.config.url}`;
					break;
				case 408:
					msg = "请求超时！";
					break;
				case 409:
					msg = "系统已存在相同数据！";
					break;
				case 500:
					msg = "服务器内部错误！";
					break;
				case 501:
					msg = "服务未实现！";
					break;
				case 502:
					msg = "网关错误！";
					break;
				case 503:
					msg = "服务不可用！";
					break;
				case 504:
					msg = "服务暂时无法访问，请稍后再试！";
					break;
				case 505:
					msg = "HTTP 版本不受支持！";
					break;
				default:
					msg = "异常问题，请联系管理员！";
					break;
			}
		}
		//http错误进行提醒
		message.error(msg);
		return Promise.reject(msg);
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

export {URL,TOKEN_NAME,getToken,setToken,removeToken}

export default request;
