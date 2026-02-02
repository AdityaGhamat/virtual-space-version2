import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { room } from "./room";
import { relations } from "drizzle-orm";
export const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  roomId: uuid("roomId")
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),
});

export const messageRelations = relations(message, ({ one }) => ({
  author: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
  room: one(room, {
    fields: [message.roomId],
    references: [room.id],
  }),
}));
