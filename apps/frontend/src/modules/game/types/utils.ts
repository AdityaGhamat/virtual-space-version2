export type RoomCapability = "chat" | "video_call" | "whiteboard";
export interface IRoomType {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  capabilities: RoomCapability[];
}

export type SpaceShipRoomType = IRoomType[];

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  senderName: string;
};

export interface RemoteStream {
  stream: MediaStream;
  consumerId: string;
  kind: "audio" | "video";
  producerId: string;
}
