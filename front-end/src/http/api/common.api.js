import request from "@/http/http.request.js";

/**
 * doSearch
 * @param {object} params SearchRequest
 * @param current
 * @param size
 * @param {string} params.keyword
 * @param {string} params.searchType 可用值:USER,GROUP,FRIEND,ALL
 * @returns
 */
export function doSearch(params,current,size) {
    return request.post(`/common/doSearch?current=${current}&size=${size}`, params);
}