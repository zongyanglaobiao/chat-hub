import request from "@/http/http.request.js";
/**
 * doAddFriend
 * @param {string} friendId
 * @returns
 */
export function doAddFriend(friendId) {
    return request.get(`/user/friend/doAddFriend/${friendId}`);
}

/**
 * doDeleteFriend
 * @param {string} friendId
 * @returns
 */
export function doDeleteFriend(friendId) {
    return request.get(`/user/friend/doDeleteFriend/${friendId}`);
}

/**
 * doQueryFriend
 * @returns
 */
export function doQueryFriend() {
    return request.get(`/user/friend/doQueryFriend`);
}

/**
 * doYesOrNoAgreeFriend
 * @param {string} id
 * @param {string} type 可用值:AGREE_YES,AGREE_NO
 * @returns
 */
export function doYesOrNoAgreeFriend(id, type) {
    return request.get(`/user/friend/doYesOrNoAgreeFriend/${id}?type=${type}`);
}

export function doYesAgreeFriend(id) {
    return doYesOrNoAgreeFriend(id,'AGREE_YES');
}

export function doNoAgreeFriend(id) {
    return doYesOrNoAgreeFriend(id,'AGREE_NO');
}


/**
 * doIsMyFriend
 * @param {string} friendId
 * @returns
 */
export function doIsMyFriend(friendId) {
    return request.get(`/user/friend/doIsMyFriend/${friendId}`);
}