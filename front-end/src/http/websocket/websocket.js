
const WEBSOCKET_URL = "ws://127.0.0.1:8080//chat/websocket/";

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

export function createMsgContent(text, roomId, userId) {
    return {
        text: text,
        roomId: roomId,
        userId: userId,
    }
}
