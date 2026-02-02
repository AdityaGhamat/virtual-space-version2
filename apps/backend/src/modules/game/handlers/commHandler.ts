import { Server, Namespace } from "socket.io";
import { ClientToCommEvents, CommToClientEvents } from "../../core/types/game";
import messageService from "../../message/service/message.service";

export const commHandler = (io: Server) => {
  const commNamespace = io.of("/comm") as Namespace<
    ClientToCommEvents,
    CommToClientEvents
  >;

  commNamespace.on("connection", (socket) => {
    socket.on("joinChatRoom", async ({ roomId, roomName }) => {
      const chatChannel = `room:${roomId}`;

      socket.join(chatChannel);
      socket.to(chatChannel).emit("userJoinedChat", { id: socket.id });

      try {
        const history = await messageService.getRoomHistory(roomId);

        const formattedHistory = history.map((record) => ({
          id: record.id,
          username: record.username || "Unknown",
          message: record.content,
          timestamp: new Date(record.sentAt!).getTime(),
          senderId: record.userId,
        }));

        socket.emit("chatHistory", formattedHistory.reverse());
      } catch (error) {
        console.error("History fetch error:", error);
      }
    });

    socket.on("sendMessage", async ({ message, roomId, username, userId }) => {
      const chatChannel = `room:${roomId}`;
      const timestamp = Date.now();

      commNamespace.to(chatChannel).emit("chatMessage", {
        id: Math.random().toString(),
        username: username,
        message: message,
        timestamp: timestamp,
        senderId: userId || socket.id,
      });

      if (userId) {
        await messageService.enqueueMessage({
          roomId,
          userId,
          username,
          message,
        });
      }
    });

    socket.on("leaveChatRoom", ({ roomId }) => {
      const chatChannel = `room:${roomId}`;
      socket.leave(chatChannel);
    });
  });
};
