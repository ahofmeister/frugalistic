import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	integer,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import type { TransactionType } from "@/drizzle/schema/transaction-schema";
import { users } from "@/drizzle/schema/users-schema";

export const favoriteSchema = pgTable(
	"favorite",
	{
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		description: varchar().notNull(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		amount: integer().notNull(),
		type: text("type").$type<TransactionType>().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		categoryId: uuid("category_id").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "favorite_category_fkey",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "favorite_user_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("User can see favorites", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid()
                       = user_id)`,
			withCheck: sql`(auth.uid()
                           = user_id)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
	],
);
