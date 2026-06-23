import { io } from 'socket.io-client';

let socketInstance = null;

export function isRealtimeEnabled() {
    return import.meta.env.VITE_DISABLE_REALTIME !== 'true';
}

export function initializeSocket(projectId) {
    if (!isRealtimeEnabled()) {
        return null;
    }

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
    if (!socketInstance) {
        return false;
    }

    socketInstance?.emit(eventName, data);
    return true;
}

export function disconnectSocket() {
    socketInstance?.disconnect();
    socketInstance = null;
}
