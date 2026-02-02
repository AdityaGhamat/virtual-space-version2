import { z } from "zod";
export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(30),
  }),
});

export const roomIdSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
