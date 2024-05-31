import {createAsyncThunk} from "@reduxjs/toolkit";
import {getRandomId} from "@/lib/toolkit/util.js";
import {doGetInfo} from "@/http/api/user.api.js";

export const groupInfoThunk = createAsyncThunk(getRandomId(),async ()=>{
    const res = await doGetInfo(null);
    return res.data;
})