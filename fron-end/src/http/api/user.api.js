import request from "@/http/http.request.js";
import {isNullOrUndefined} from "@/lib/toolkit/util.js";

/**
 * doRegister
 * @param {object} params SysUser_INSERT
 * @param {string} params.mail
 * @param {string} params.password
 * @returns
 */
export function doRegister(params) {
    return request.post(`/user/doRegister`, params);
}


/**
 * doLogin
 * @param {object} params SysUser_INSERT
 * @param {string} params.mail
 * @param {string} params.password
 * @returns
 */
export function doLogin(params) {
    return request.post(`/user/doLogin`, params);
}

/**
 * doModify
 * @param {object} params SysUser_UPDATE
 * @param {string} params.id
 * @param {string} params.signature
 * @param {string} params.gender
 * @param {string} params.nickname
 * @param {number} params.isOnline
 * @param {string} params.avatar
 * @returns
 */
export function doModify(params) {
    return request.post(`/user/doModify`, params);
}

/**
 * doGetInfo
 * @param {string} userId
 * @returns
 */
export function doGetInfo(userId) {
    return request.get("/user/doGetInfo" + (isNullOrUndefined(userId) ? "" : `?userId=${userId}`));
}