import { foreignKey, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { profiles } from "@/drizzle/schema/profile-schema";
import { createdAt, updatedAt } from "@/drizzle/schema/schema-commons";

export const accountSchema = pgTable(
	"account",
	{
		id: uuid().primaryKey().defaultRandom(),
		createdAt,
		updatedAt,
		userId,
		name: text().notNull(),
	},
	(_) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "profile_user_id_fk",
		}),
		pgPolicy("account members can view", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
			)`,
		}),
		pgPolicy("authenticated users can create accounts", {
			as: "permissive",
			for: "insert",
			to: ["public"],
			withCheck: sql`(SELECT auth.uid()) IS NOT NULL`,
		}),
		pgPolicy("account owner can manage account", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)`,
			withCheck: sql`EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)`,
		}),
	],
);
