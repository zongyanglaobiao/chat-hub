import {configureStore} from "@reduxjs/toolkit";
import {tipMessageReducer} from "@/redux/feature/default.redux.js";
import {composeWithDevTools} from "@redux-devtools/extension";

//存储状态
export const store = configureStore({
	reducer:{
		tipMsg:tipMessageReducer
	},
	devTools:composeWithDevTools(),
	middleware : (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false
		})
	}
});
