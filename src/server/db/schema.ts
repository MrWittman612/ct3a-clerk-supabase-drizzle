// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
// import { serial } from "drizzle-orm/mysql-core";
import {
  integer,
  pgTable,
  pgTableCreator,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `ct3a-clerk-supabase-drizzle_${name}`,
);

export const postsTable = pgTable("posts", {
  id: integer("id")
    .primaryKey()
    .notNull()
    .default(sql`nextval('posts_id_seq')`),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk User ID
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
