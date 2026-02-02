import { relations } from "drizzle-orm";
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { message } from "./message";

export const room = pgTable("room", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const roomRelations = relations(room, ({ many }) => ({
  messages: many(message),
}));
