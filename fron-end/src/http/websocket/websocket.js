
const WEBSOCKET_URL = "ws://127.0.0.1:8080//chat/websocket/";

let socket = null

/*socket.onopen = function(e) {
    console.log('Connection established');
    socket.send('Hello Server!');
};

socket.onmessage = function(event) {
    console.log('Message from server ', event.data);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('Connection died');
    }
};

socket.onerror = function(error) {
    console.error(`WebSocket error observed: `, error);
};*/

export function send() {

}

export function receive() {

}

export function closeWebsocket() {
    socket.close()
}

export function open() {
    socket.onopen = function(e) {
        console.log('websocket Connection established',e);
    };
}

export function newWebSocket(roomId) {
    socket =  new WebSocket(WEBSOCKET_URL.concat(roomId));
}