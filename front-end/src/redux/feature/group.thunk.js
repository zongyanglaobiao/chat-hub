import {createAsyncThunk} from "@reduxjs/toolkit";
import {getRandomId} from "@/lib/toolkit/util.js";
import {ALL, doGetGroup} from "@/http/api/group.info.api.js";
import {generateSlice} from "@/lib/toolkit/redux.util.js";

const groupInfoThunk = createAsyncThunk(getRandomId(),async ()=>{
    const res = await doGetGroup(ALL);
    return res.data;
})

const groupThunkProcessor = generateSlice(getRandomId(),[],{},build => {
    build.addCase(groupInfoThunk.fulfilled,(state, action)=>{
        return [...action.payload]
    })
})

export const groupReducer = groupThunkProcessor.reducer
export {groupInfoThunk}
