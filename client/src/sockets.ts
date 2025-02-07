import { io } from "socket.io-client";

const roomId = window.location.pathname.split("/").pop();
export const socket = io({transports: ['websocket'], query: { roomId }});
