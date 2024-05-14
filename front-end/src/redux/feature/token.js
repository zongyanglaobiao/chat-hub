import {generateSlice} from "@/lib/toolkit/redux.util.js";
import {getRandomId} from "@/lib/toolkit/util.js";
import {TOKEN_NAME} from "@/http/http.request.js";

//token处理器
const tokenProcessor = generateSlice(getRandomId(),
    '',
    {
        setTokenAction(state,action){
            setToken(action.payload)
            return getToken()
        }
    })

const getToken = () => {
    return localStorage.getItem(TOKEN_NAME) || ''
}

const setToken = (token) => {
    localStorage.setItem(TOKEN_NAME, token)
}

const removeToken = () => {
    localStorage.removeItem(TOKEN_NAME)
}

export const tokenReducer = tokenProcessor.reducer
export const {setTokenAction} = tokenProcessor.actions
export {removeToken,getToken, setToken}