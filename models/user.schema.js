import {pgEnum, pgTable, uuid, varchar, text, timestamp} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MODERATOR", "USER"])

export const usersTable = pgTable("users", ({
    id: uuid().primaryKey().defaultRandom(),

    firstName: varchar("first_name", {length: 55}).notNull(),
    lastName: varchar("last_name", {length: 55}),

    email: varchar({length: 255}).notNull().unique(),

    role: userRoleEnum().default("USER").notNull(),

    password: text().notNull(),
    salt: text().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull()
}))