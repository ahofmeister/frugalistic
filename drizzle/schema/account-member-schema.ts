import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	index,
	pgEnum,
	pgPolicy,
	pgTable,
	primaryKey,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { profiles } from "@/drizzle/schema/profile-schema";
import { createdAt } from "@/drizzle/schema/schema-commons";

export const accountRoles = ["read", "write"] as const;
export type AccountRole = (typeof accountRoles)[number];

export const accountRoleEnum = pgEnum("account_role", accountRoles);

export const accountMemberSchema = pgTable(
	"account_member",
	{
		createdAt,
		accountId: uuid("account_id").notNull(),
		memberId: uuid("member_id").notNull(),
		role: text().$type<AccountRole>().notNull(),
	},
	(table) => [
		check(
			"account_member_role_check",
			sql`role = ANY (ARRAY[${sql.join(
				accountRoles.map((r) => sql`${r}`),
				sql`, `,
			)}])`,
		),
		primaryKey({ columns: [table.accountId, table.memberId] }),
		index("account_member_member_id_idx").on(table.memberId),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "account_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.memberId],
			foreignColumns: [profiles.id],
			name: "profile_id",
		}).onDelete("cascade"),
		pgPolicy("account member can view their membership", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`member_id = (SELECT auth.uid()) OR is_account_member(account_id)`,
		}),
		pgPolicy("account owner can add members", {
			as: "permissive",
			for: "insert",
			to: ["public"],
			withCheck: sql`is_account_owner(account_id)`,
		}),
		pgPolicy("account owner can update members", {
			as: "permissive",
			for: "update",
			to: ["public"],
			using: sql`is_account_owner(account_id)`,
			withCheck: sql`is_account_owner(account_id)`,
		}),
		pgPolicy("account owner can delete members", {
			as: "permissive",
			for: "delete",
			to: ["public"],
			using: sql`is_account_owner(account_id)`,
		}),
	],
);
