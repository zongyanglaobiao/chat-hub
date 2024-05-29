import {useEffect, useState} from "react";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";

/**
 * 用于请求的HOOK
 * @param defaultValue 请求的默认值
 * @param requestMethod 请求方法
 * @param isDebug 是否开启debug模式
 * @returns response 请求返回值
 * @returns error 请求的错误
 * @returns setProxyMethodParam  设置代理请求方法的参数
 */
const useFetch = (defaultValue,requestMethod,isDebug = false) =>{
    //请求返回值
    const [response, setResponse] = useState(defaultValue)
    //代理方法的请求参数
    const [requestMethodParam, setRequestMethodParam] = useState([])
    //方法抛出异常的
    const [error, setError] = useState(null)

    //如果传NULL表示代理的方法不需要参数
    const setProxyMethodParam = (...param) => {
        setRequestMethodParam(param.length === 0 ? null : [...param])
    }

    useEffect(() => {
        try {
            isDebug && console.log('useFetch requestMethodParam', requestMethodParam)
            //避免初次渲染出现
            if (!isNullOrUndefined(requestMethodParam) && requestMethodParam.length === 0) {
              return
            }
            (async () => {
                const resp = isNullOrUndefined(requestMethodParam) ? await requestMethod() : await requestMethod(...requestMethodParam);
                setResponse(resp)
                isDebug && console.log('useFetch requestMethodParam', requestMethodParam)
                isDebug && console.log('useFetch response', resp)
            })()
        } catch (e) {
            isDebug && console.log('useFetch method error', e)
            setError(e)
        }
    }, [requestMethodParam]);

    return {
        response,
        error,
        setProxyMethodParam
    }
}

export {useFetch}