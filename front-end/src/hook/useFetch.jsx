import {useCallback, useEffect, useState} from "react";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";

/**
 * 用于请求的HOOK
 * 给我请求方法我给你返回值
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
                    console.log('请求参数', requestMethodParam)
                    console.log('请求返回值', resp)
                }
            })()
        } catch (e) {
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