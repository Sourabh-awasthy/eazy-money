import { io } from "socket.io-client";

// Connect to your backend URL
export const socket = io("http://localhost:8080", {
    autoConnect: true,
});