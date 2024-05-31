import request from "@/http/http.request.js";

/**
 * doIsInGroup
 * @param {string} groupId
 * @returns
 */
export function doIsInGroup(groupId) {
    return request.get(`/group/member/doIsInGroup?groupId=${groupId}`);
}

export const MY = "MY";
export const IN = "IN";
export const ALL = "ALL";

/**
 * getMyGroup
 * @param {string} getType 可用值:MY,IN
 * @returns
 */
export function getMyGroup(getType) {
    return request.get(`/group/information/getGroup?getType=${getType}`);
}

