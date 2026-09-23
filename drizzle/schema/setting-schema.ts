import { sql } from "drizzle-orm";
import { foreignKey, pgPolicy, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import { users } from "@/drizzle/schema/users-schema";

export const settingSchema = pgTable(
	"setting",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		dateFormat: text("date_format").default("dd.MM.yyyy").notNull(),
		importDefaultCategory: uuid("import_default_category"),
		userId: uuid("user_id").default(sql`auth.()`).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "setting_user_id_fkey",
		}).onDelete("cascade"),
		unique("setting_user_id_key").on(table.userId),
		foreignKey({
			columns: [table.importDefaultCategory],
			foreignColumns: [categories.id],
			name: "settings_importDefaultCategory_fkey",
		}),
		pgPolicy("Allow users to delete their own entries", {
			as: "permissive",
			for: "delete",
			to: ["public"],
			using: sql`(user_id = auth.uid())`,
		}),
		pgPolicy("Allow users to insert a new entry", {
			as: "permissive",
			for: "insert",
			to: ["public"],
		}),
		pgPolicy("Allow users to read their own entries", {
			as: "permissive",
			for: "select",
			to: ["public"],
		}),
		pgPolicy("Allow users to update their own entries", {
			as: "permissive",
			for: "update",
			to: ["public"],
		}),
	],
);
