import { sql } from "drizzle-orm";
import { foreignKey, index, pgPolicy, pgTable, text } from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { accountId, createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
import { users } from "@/drizzle/schema/users-schema";

export const categories = pgTable(
	"categories",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		accountId,
		name: text().notNull(),
		color: text().notNull(),
		description: text(),
		icon: text(),
	},
	(table) => [
		index("categories_account_id_idx").on(table.accountId),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "categories_user_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "categories_account_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("account members can select", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
			)`,
		}),
		pgPolicy("account write members can manage rows", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
			withCheck: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
		}),
	],
);
