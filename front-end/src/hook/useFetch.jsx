import {useEffect, useState} from "react";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";

/**
 * 用于请求的HOOK
 * @param defaultValue 请求的默认值
 * @param requestMethod 请求方法
 * @param isDebug 是否开启debug模式
 * @returns response 请求返回值
 * @returns error 请求的错误
 * @returns setRequestMethodParam  设置请求方法的参数
 */
const useFetch = (defaultValue,requestMethod,isDebug = false) =>{
    //请求返回值
    const [response, setResponse] = useState(defaultValue)
    //代理方法的请求参数
    const [requestMethodParam, setRequestMethodParam] = useState(null)
    //方法抛出异常的
    const [error, setError] = useState(null)

    useEffect(() => {
        try {
            !isNullOrUndefined(requestMethodParam)
            &&
            (async () => {
                const resp = await requestMethod(requestMethodParam);
                setResponse(resp)
                if (isDebug) {
                    console.log('useFetch requestMethodParam', requestMethodParam)
                    console.log('useFetch response', resp)
                }
            })()
        } catch (e) {
            isDebug && console.log('useFetch method error', e)
            setError(e)
        }
    }, [requestMethodParam]);

    return {
        response,
        error,
        setRequestMethodParam
    }
}

export {useFetch}