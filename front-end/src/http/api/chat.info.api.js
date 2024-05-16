import request from "@/http/http.request.js";


/**
 * getChatInfo
 * @param {string} roomId
 * @param current 当前页
 * @param size 页面地址
 * @returns 聊天信息
 */
export function getChatInfo(roomId, current = 1, size = 100) {
    return request.get(`/chat/information/page/getChatInfo?roomId=${roomId}&current=${current}&size=${size}`);
}