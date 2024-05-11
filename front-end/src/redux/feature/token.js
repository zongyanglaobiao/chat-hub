import {generateSlice} from "@/lib/toolkit/redux.util.js";
import {getRandomId} from "@/lib/toolkit/util.js";

//token处理器
const tokenProcessor = generateSlice(getRandomId(),
    '',
    {
        storeToken(state,action){
            return action.payload
        }
    })

export const tokenReducer = tokenProcessor.reducer
export const storeTokenAction = tokenProcessor.actions.storeToken