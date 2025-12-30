// src/lib/ws.ts
import { io, type Socket } from "socket.io-client";
import { token } from "./token";

let socket: Socket | null = null;

function getWsUrl() {
  const api = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  return api.replace(/\/api\/?$/, "");
}

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(getWsUrl(), {
    transports: ["websocket"],
    autoConnect: true,
    auth: {
      token: token.get() ? `Bearer ${token.get()}` : undefined,
    },
  });

  return socket;
}

export function joinProjectRoom(projectId: string) {
  const s = getSocket();
  s.emit("join:project", projectId);
}

export function leaveProjectRoom(projectId: string) {
  const s = getSocket();
  s.emit("leave:project", projectId);
}

export function joinUserRoom(userId: string) {
  const s = getSocket();
  s.emit("join:user", userId);
}

export function leaveUserRoom(userId: string) {
  const s = getSocket();
  s.emit("leave:user", userId);
}
