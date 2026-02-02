import { Server, Socket } from "socket.io";
import {
  ClientToCommEvents,
  CommToClientEvents,
  PlayerData,
} from "../../core/types/game";

import { db } from "../../core/database";
import { room as roomSchema } from "../../core/database/schema";
import { eq } from "drizzle-orm";

const players: Record<string, PlayerData> = {};

export const gameHandler = (io: Server) => {
  const gameNamespace = io.of("/game");

  const leavePreviousRooms = (socket: Socket) => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  };

  gameNamespace.on("connection", (socket) => {
    console.log(`User connected to /game: ${socket.id}`);

    socket.on("checkRoom", async (roomId, callback) => {
      try {
        const foundRoom = await db.query.room.findFirst({
          where: eq(roomSchema.id, roomId),
        });
        callback({ exists: !!foundRoom });
      } catch (error) {
        console.error("DB Error checking room:", error);
        callback({ exists: false });
      }
    });

    socket.on("initPlayer", async ({ x, y, room, username, skin, roomId }) => {
      const roomExists = await db.query.room.findFirst({
        where: eq(roomSchema.id, roomId),
      });

      if (!roomExists) {
        socket.emit("error", { message: "Room not found in database" });
        return;
      }

      console.log(`Player ${socket.id} joining Valid DB Room: ${roomId}`);

      const safeSkin = ["player", "player2"].includes(skin) ? skin : "player";
      leavePreviousRooms(socket);

      socket.join(roomId);

      players[socket.id] = {
        id: socket.id,
        username: username || `Astronaut ${socket.id.slice(0, 4)}`,
        skin: safeSkin,
        x,
        y,
        room,
      };

      const existingPlayers = Object.values(players).filter(
        (p) =>
          p.id !== socket.id &&
          gameNamespace.adapter.rooms.get(roomId)?.has(p.id)
      );

      socket.emit("existingPlayers", existingPlayers);
      socket.to(roomId).emit("playerConnected", players[socket.id]);
    });

    socket.on("move", ({ x, y }) => {
      if (players[socket.id]) {
        players[socket.id].x = x;
        players[socket.id].y = y;

        const rooms = Array.from(socket.rooms);
        const roomId = rooms.find((r) => r !== socket.id);

        if (roomId) {
          socket.to(roomId).emit("move", { id: socket.id, x, y });
        }
      }
    });

    socket.on("moveEnd", () => {
      const rooms = Array.from(socket.rooms);
      const roomId = rooms.find((r) => r !== socket.id);

      if (roomId) {
        socket.to(roomId).emit("moveEnd", { id: socket.id });
      }
    });

    socket.on("playerRoomChanged", ({ room, x, y }) => {
      if (players[socket.id]) {
        players[socket.id].room = room;
        players[socket.id].x = x;
        players[socket.id].y = y;

        const rooms = Array.from(socket.rooms);
        const roomId = rooms.find((r) => r !== socket.id);

        if (roomId) {
          socket.to(roomId).emit("playerEnteredRoom", {
            id: socket.id,
            room,
            x,
            y,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      gameNamespace.emit("playerDisconnected", { id: socket.id });
      delete players[socket.id];
    });
  });
};
