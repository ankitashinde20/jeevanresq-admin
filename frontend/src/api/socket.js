import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config.js';

let socket;

export function getSocket() {
  const token = localStorage.getItem('jrq_token');
  if (!token) return null;
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });
  }
  return socket;
}

export function resetSocket() {
  if (socket) socket.disconnect();
  socket = null;
}

