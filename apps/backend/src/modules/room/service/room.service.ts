import { eq } from "drizzle-orm";
import { db } from "../../core/database";
import { room } from "../../core/database/schema";
import { NotFoundError } from "../../core/error/httpError";
import { createRoomData } from "../type/room";
class RoomService {
  public async createRoom(request: createRoomData) {
    const { body } = request;
    const [result] = await db
      .insert(room)
      .values({
        name: body.name,
      })
      .returning();
    return result;
  }
  public async getRoom(id: string) {
    const result = await db.query.room.findFirst({
      where: eq(room.id, id),
    });
    if (!result) {
      throw new NotFoundError("Room not found");
    }
    return result;
  }
}

export default new RoomService();
