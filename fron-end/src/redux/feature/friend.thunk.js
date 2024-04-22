import {createAsyncThunk} from "@reduxjs/toolkit";
import {generateSlice} from "@/lib/toolkit/redux.util.js";
import {getRandomId} from "@/lib/toolkit/util.js";
import {doQueryFriend} from "@/http/api/friend.api.js";

export const friendListInfoThunk =  createAsyncThunk(getRandomId(),async ()=> {
    const res = await doQueryFriend();
    return res.data;
})

const friendThunkProcessor = generateSlice(getRandomId(), {}, {}, (builder) => {
    builder.addCase(friendListInfoThunk.fulfilled, (state, action) => {
        return {...action.payload}
    })
});

export const friendReducer = friendThunkProcessor.reducer;