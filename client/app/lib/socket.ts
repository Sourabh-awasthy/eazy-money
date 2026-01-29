import { io } from "socket.io-client";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const socket = io(BACKEND_URL, {
    autoConnect: true,
});