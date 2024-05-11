import request from "@/http/http.request.js";


/**
 * getChatInfo
 * @param {string} roomId
 * @returns
 */
export function getChatInfo(roomId) {
    return request.get(`/chat/information/page/getChatInfo?roomId=${roomId}`);
}