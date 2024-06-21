
const WEBSOCKET_URL = import.meta.env.VITE_REACT_APP_WEBSOCKET_PATH;

let socket = null

export function sendOfWebsocket(msgContent) {
    socket.send(JSON.stringify(msgContent))
}

export function receiveOfWebsocket(callback) {
    socket.onmessage = function(event) {
        callback(JSON.parse(event.data))
    };
}

export function closeWebsocket() {
    socket.close()
}

export function newWebSocket(roomId) {
    socket =  new WebSocket(WEBSOCKET_URL.concat(roomId));
}

export function createMsgContent(text, roomId, userId, msgType = MSG_TYPE_TEXT) {
    return {
        text: text,
        roomId: roomId,
        userId: userId,
        msgType:msgType,
        code: 200
    }
}

export const MSG_TYPE_TEXT = "TEXT"
export const MSG_TYPE_IMG = "IMG_URL"


