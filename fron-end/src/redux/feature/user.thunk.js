import {createAsyncThunk} from "@reduxjs/toolkit";
import {getRandomId} from "@/lib/toolkit/util.js";
import {doGetInfo} from "@/http/api/user.api.js";
import {generateSlice} from "@/lib/toolkit/redux.util.js";

export const userInfoThunk = createAsyncThunk(getRandomId(),async ()=>{
    const res = await doGetInfo(null);
    return res.data;
})

const userThunkProcessor = generateSlice(getRandomId(),
    {},
    {},
    (builder)=> {
        //用户信息
        builder.addCase(userInfoThunk.fulfilled,(state, action)=>{
            return {...action.payload}
        })
    })

export const userReducer = userThunkProcessor.reducer;
