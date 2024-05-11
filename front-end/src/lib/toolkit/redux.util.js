import {createSlice} from "@reduxjs/toolkit";
import {isObject} from "@/lib/toolkit/util.js";


const intiFunction = () => {}
/**
 * 生成slice
 * @param name
 * @param initialState
 * @param reducers
 * @param extraReducersCallback
 * @returns {Slice<unknown, SliceCaseReducers<unknown>, string>}
 */
export const generateSlice = (name,initialState,reducers, extraReducersCallback = intiFunction) => {
	if (!isObject(reducers)) {
		throw new Error("reducers is not an object");
	}
	return createSlice({
		name:name,
		initialState:initialState,
		reducers:reducers,
		extraReducers:(builder) => {
			extraReducersCallback(builder)
		}
	})
};
