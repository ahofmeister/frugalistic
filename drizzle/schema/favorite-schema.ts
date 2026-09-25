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
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
import type { TransactionType } from "@/drizzle/schema/transaction-schema";
import { users } from "@/drizzle/schema/users-schema";

export const favoriteSchema = pgTable(
	"favorite",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		accountId: uuid("account_id"),
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
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
			)`,
		}),
		pgPolicy("account write members can manage rows", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
			withCheck: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
	],
);
