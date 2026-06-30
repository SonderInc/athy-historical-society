import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  verificationToken: text("verification_token").notNull(),
  verified: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
