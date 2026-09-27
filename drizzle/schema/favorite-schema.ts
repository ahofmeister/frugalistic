import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	index,
	integer,
	pgPolicy,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import { accountId, createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
import type { TransactionType } from "@/drizzle/schema/transaction-schema";
import { users } from "@/drizzle/schema/users-schema";

export const favoriteSchema = pgTable(
	"favorite",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		accountId,
		description: varchar().notNull(),
		amount: integer().notNull(),
		type: text("type").$type<TransactionType>().notNull(),
		categoryId: uuid("category_id").notNull(),
	},
	(table) => [
		index("favorite_account_id_idx").on(table.accountId),
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
		pgPolicy("account members can select", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`is_account_member(account_id)`,
		}),
		pgPolicy("account write members can manage rows", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`is_account_writer(account_id)`,
			withCheck: sql`is_account_writer(account_id)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
			    ::text <> ''::text`,
		),
	],
);
