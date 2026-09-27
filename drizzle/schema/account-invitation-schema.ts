import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, uuid } from "drizzle-orm/pg-core";
import { type AccountRole, accountRoleEnum } from "@/drizzle/schema/account-member-schema";
import { profiles } from "@/drizzle/schema/profile-schema";
import { accountId, createdAt, id, updatedAt } from "./schema-commons";

export const accountInvitationSchema = pgTable(
	"accountInvitation",
	{
		id,
		createdAt,
		updatedAt,
		accountId,
		fromMemberId: uuid("from_member_id")
			.references(() => profiles.id, {
				onDelete: "cascade",
			})
			.notNull(),
		toMemberId: uuid("to_member_id")
			.references(() => profiles.id, {
				onDelete: "cascade",
			})
			.notNull(),
		accountRole: accountRoleEnum("account_role").$type<AccountRole>().notNull(),
	},
	(table) => [
		pgPolicy("sender can manage invitation", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`auth.uid() = ${table.fromMemberId}`,
			withCheck: sql`auth.uid() = ${table.fromMemberId}`,
		}),
		pgPolicy("recipient can view and respond", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`auth.uid() = ${table.toMemberId} OR auth.uid() = ${table.fromMemberId}`,
		}),
		pgPolicy("recipient can delete to decline", {
			as: "permissive",
			for: "delete",
			to: ["public"],
			using: sql`auth.uid() = ${table.toMemberId}`,
		}),
	],
);
