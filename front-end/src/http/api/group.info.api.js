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
 * doGetGroup
 * @param {string} getType 可用值:MY,IN,ALL
 * @returns
 */
export function doGetGroup(getType) {
    return request.get(`/group/information/doGetGroup?getType=${getType}`);
}

/**
 * doCreateOrModify
 * @param {object} data SysGroupInformation_SaveOrUpdate
 * @param {string} data.id
 * @param {string} data.groupName
 * @param {string} data.avatar
 * @returns
 */
export function doCreateOrModify(data) {
    return request.post(`/group/information/doCreateOrModify`, data);
}