import { io } from "socket.io-client";

const roomId = window.location.pathname.split("/").pop();
const backendUrl = await import.meta.env.VITE_BACKEND_URL;

export const socket = io(backendUrl, {
  transports: ["websocket"],
  query: { roomId },
});
