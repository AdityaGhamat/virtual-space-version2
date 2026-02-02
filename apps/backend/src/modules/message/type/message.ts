import { z } from "zod";
import {
  sendMessageSchema,
  getRoomMessagesSchema,
} from "../validation/message";

export type sendMessageData = z.infer<typeof sendMessageSchema>;
export type getRoomMessagesData = z.infer<typeof getRoomMessagesSchema>;
