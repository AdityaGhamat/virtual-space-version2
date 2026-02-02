import { z } from "zod";
import { createRoomSchema, roomIdSchema } from "../validation/room";
export interface IRoom {
  id: string;
  name: string;
}

export type createRoomData = z.infer<typeof createRoomSchema>;
export type roomIdData = z.infer<typeof roomIdSchema>;
