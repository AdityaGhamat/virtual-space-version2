export interface PlayerData {
  id: string;
  username: string;
  x: number;
  y: number;
  skin: string;
  room: string | null;
}

// ... (ServerToClientEvents and ClientToServerEvents remain the same) ...

export interface ClientToCommEvents {
  joinChatRoom: (data: { roomId: string; roomName: string }) => void;
  leaveChatRoom: (data: { roomId: string }) => void;
  sendMessage: (data: {
    message: string;
    roomId: string;
    username: string;
    userId: string; // [NEW] Required for DB Foreign Key
    roomName?: string;
  }) => void;
}

export interface CommToClientEvents {
  chatMessage: (data: {
    id: string;
    message: string;
    username: string;
    timestamp: number;
    senderId: string;
  }) => void;

  chatHistory: (
    data: Array<{
      id: string;
      message: string;
      username: string;
      timestamp: number;
      senderId: string;
    }>
  ) => void;

  userJoinedChat: (data: { id: string }) => void;
  userLeftChat: (data: { id: string }) => void;
}
