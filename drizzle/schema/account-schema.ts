import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";

export const accountSchema = pgTable(
	"account",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		name: text().notNull(),
	},
	() => [
		pgPolicy("account members can view", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`is_account_member(id)`,
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
			using: sql`is_account_owner(id)`,
			withCheck: sql`is_account_owner(id)`,
		}),
	],
);
