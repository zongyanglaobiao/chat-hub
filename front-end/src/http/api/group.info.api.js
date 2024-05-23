import request from "@/http/http.request.js";

/**
 * doIsInGroup
 * @param {string} groupId
 * @returns
 */
export function doIsInGroup(groupId) {
    return request.get(`/group/member/doIsInGroup?groupId=${groupId}`);
}