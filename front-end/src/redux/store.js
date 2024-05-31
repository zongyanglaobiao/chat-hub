import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "@/redux/feature/user.thunk.js";
import {friendReducer} from "@/redux/feature/friend.thunk.js";
import {composeWithDevTools} from "@redux-devtools/extension";
import {authorizeReducer} from "@/redux/feature/authorize.js";
import {groupReducer} from "@/redux/feature/group.thunk.js";

//存储状态
export const store = configureStore({
	reducer:{
		userInfo:userReducer,
		friendInfo:friendReducer,
		authorize:authorizeReducer,
		groupInfo:groupReducer
	},
	devTools:composeWithDevTools(),
	middleware : (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false
		})
	}
});
