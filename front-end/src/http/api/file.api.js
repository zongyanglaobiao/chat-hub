import request, {URL} from "@/http/http.request.js";

/**
 * doDownload
 * @param {string} downloadId
 * @returns
 */
export function doDownload(downloadId) {
    return request.get(`/file/doDownload/${downloadId}`);
}

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