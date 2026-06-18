import { io } from 'socket.io-client';

const ENDPOINT = `\${import.meta.env.VITE_BACKEND_URL || '\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}`;

export const socket = io(ENDPOINT, {
  autoConnect: true,
});
