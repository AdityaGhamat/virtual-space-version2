import type { Socket } from "socket.io-client";
export interface ISocketContext {
  gameSocket: Socket | null;
  commSocket: Socket | null;
  mediaSocket: Socket | null;
}
