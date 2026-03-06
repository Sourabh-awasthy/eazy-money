import { io } from "socket.io-client";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const socket = io(NEXT_PUBLIC_BACKEND_URL, {
    autoConnect: true,
});