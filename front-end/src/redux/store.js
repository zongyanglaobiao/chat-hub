import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "@/redux/feature/user.thunk.js";
import {friendReducer} from "@/redux/feature/friend.thunk.js";
import {composeWithDevTools} from "@redux-devtools/extension";
import {tokenReducer} from "@/redux/feature/token.js";

//存储状态
export const store = configureStore({
	reducer:{
		userInfo:userReducer,
		friendInfo:friendReducer,
		token:tokenReducer
	},
	devTools:composeWithDevTools(),
	middleware : (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false
		})
	}
});
