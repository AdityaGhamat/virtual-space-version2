import Phaser from "phaser";
import type { RoomCapability } from "./utils";
export interface SpaceShipRoom {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
  capabilities: RoomCapability[];
}

export interface LocalPlayer {
  sprite: (Phaser.GameObjects.Sprite & { currentRoom?: string }) | null;
  movedLastFrame: boolean;
}

export interface RemotePlayer {
  sprite: Phaser.GameObjects.Sprite;
  nameTag: Phaser.GameObjects.Text;
  moving: boolean;
  room: string | null;
  targetX?: number;
  targetY?: number;
}

export interface PlayerData {
  id: string;
  x: number;
  y: number;
  username: string;
  room: string | null;
  skin: string;
}

export interface ServerToClientEvents {
  playerConnected: (data: PlayerData) => void;
  existingPlayers: (data: PlayerData[]) => void;
  playerDisconnected: (data: { id: string }) => void;
  error: (data: { message: string }) => void;
  move: (data: { id: string; x: number; y: number }) => void;
  moveEnd: (data: { id: string }) => void;

  playerEnteredRoom: (data: {
    id: string;
    room: string;
    x: number;
    y: number;
  }) => void;
}

export interface ClientToServerEvents {
  initPlayer: (data: {
    x: number;
    y: number;
    room: string | null;
    username: string;
    skin: string;
    roomId: string;
  }) => void;

  move: (data: { x: number; y: number }) => void;
  moveEnd: () => void;
  createRoom: (callback: (response: { roomId: string }) => void) => void;
  checkRoom: (
    roomId: string,
    callback: (response: { exists: boolean }) => void
  ) => void;
  playerRoomChanged: (data: { room: string; x: number; y: number }) => void;
}

export interface ClientToCommEvents {
  joinChatRoom: (data: { roomId: string; roomName: string }) => void;
  leaveChatRoom: (data: { roomId: string }) => void;
  sendMessage: (data: {
    message: string;
    roomId: string;
    roomName: string;
  }) => void;
}

export interface CommToClientEvents {
  chatMessage: (data: {
    id: string;
    message: string;
    timestamp: number;
  }) => void;
  userJoinedChat: (data: { id: string }) => void;
  userLeftChat: (data: { id: string }) => void;
}
