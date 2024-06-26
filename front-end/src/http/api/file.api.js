import request, {URL} from "@/http/http.request.js";

/**
 * doUpload
 * @param {string} file
 * @returns
 */
export function doUpload(file) {
    return request.post(`/file/doUpload?file=${file}`);
}

export function getUploadUrl()  {
    return URL + 'file/doUpload'
}