import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
    id: int().primaryKey({ autoIncrement: true }),
    email: text().notNull().unique(),
    created_at: text(),
    updated_at: text(),
});

export const webhookUserReadedNewslettersTable = sqliteTable("webhook_user_readed_newsletters_table", {
    email: text().notNull().unique().primaryKey(),
    id: text().notNull(),
    utm_source: text(),
    utm_medium: text(),
    utm_campaign: text(),
    utm_channel: text(),
    created_at: text(),
    updated_at: text(),
});

export const usersStreakTable = sqliteTable("users_streak_table", {
    id: int().primaryKey({ autoIncrement: true }),
    user_id: int().notNull().references(() => usersTable.id),
    streak: int().notNull(),
    best_streak: int().notNull(),
    created_at: text(),
    updated_at: text(),
});