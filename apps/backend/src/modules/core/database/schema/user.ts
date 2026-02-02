import { relations } from "drizzle-orm";
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { message } from "./message";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  messages: many(message),
}));
