import type { SpaceShipRoom } from "../types/game";
import { spaceshipRooms } from "./spaceshipRooms";

export function getPlayerRoom(
  playerX: number,
  playerY: number
): SpaceShipRoom | null {
  const rooms = [...spaceshipRooms].reverse();

  for (const room of rooms) {
    if (
      playerX >= room.x &&
      playerX <= room.x + room.width &&
      playerY >= room.y &&
      playerY <= room.y + room.height
    ) {
      console.log(`room : ${room}`);
      return room;
    }
  }
  return null;
}
