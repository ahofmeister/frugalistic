import { sql } from "drizzle-orm";
import { foreignKey, index, pgPolicy, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { categories } from "@/drizzle/schema/categories";
import { accountId, id, userId } from "@/drizzle/schema/schema-commons";
import { users } from "@/drizzle/schema/users-schema";

export const settingSchema = pgTable(
	"setting",
	{
		id,
		userId,
		accountId,
		dateFormat: text("date_format").default("dd.MM.yyyy").notNull(),
		importDefaultCategory: uuid("import_default_category"),
	},
	(table) => [
		index("setting_account_id_idx").on(table.accountId),
		unique("setting_user_account_key").on(table.userId, table.accountId),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "setting_user_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "setting_account_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.importDefaultCategory],
			foreignColumns: [categories.id],
			name: "settings_importDefaultCategory_fkey",
		}).onDelete("set null"),
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
	],
);
