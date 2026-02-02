import { z } from "zod";
export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(500),
    roomId: z.string().uuid(),
  }),
});

export const getRoomMessagesSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
