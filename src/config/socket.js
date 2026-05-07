import { io } from 'socket.io-client';

let socketInstance = null;

export function initializeSocket(projectId) {
    if (socketInstance) {
        socketInstance.disconnect();
    }

    socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
        auth: {
            token: localStorage.getItem('token'),
        },
        query: {
            projectId,
        },
    });

    return socketInstance;
}

export function receiveMessage(eventName, callback) {
    socketInstance?.on(eventName, callback);
}

export function sendMessage(eventName, data) {
    socketInstance?.emit(eventName, data);
}

export function disconnectSocket() {
    socketInstance?.disconnect();
    socketInstance = null;
}
