import { sql } from "drizzle-orm";
import {
	foreignKey,
	index,
	pgEnum,
	pgPolicy,
	pgTable,
	primaryKey,
	uuid,
} from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { profiles } from "@/drizzle/schema/profile-schema";

export const accountRoles = ["owner", "write", "read"] as const;
export type AccountRole = (typeof accountRoles)[number];

export const accountRoleEnum = pgEnum("account_role", accountRoles);

export const accountMemberSchema = pgTable(
	"account_member",
	{
		accountId: uuid("account_id").notNull(),
		memberId: uuid("member_id").notNull(),
		role: accountRoleEnum().$type<AccountRole>().notNull(),
	},
	(table) => [
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
			using: sql`(auth.uid() = member_id)`,
		}),
		pgPolicy("account owner can add members", {
			as: "permissive",
			for: "insert",
			to: ["public"],
			withCheck: sql`
				NOT EXISTS (
					SELECT 1 FROM account_member AS am
					WHERE am.account_id = account_member.account_id
				)
				OR EXISTS (
					SELECT 1 FROM account_member AS am
					WHERE am.account_id = account_member.account_id
					AND am.member_id = (SELECT auth.uid())
					AND am.role = 'owner'
				)
			`,
		}),
		pgPolicy("account owner can update members", {
			as: "permissive",
			for: "update",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)`,
			withCheck: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)`,
		}),
		pgPolicy("account owner can delete members", {
			as: "permissive",
			for: "delete",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)`,
		}),
	],
);
