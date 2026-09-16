import { sql } from "drizzle-orm";
import { foreignKey, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "@/drizzle/schema/users-schema";

export const categories = pgTable(
	"categories",
	{
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		name: text().notNull(),
		color: text().notNull(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		description: text(),
		icon: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "categories_user_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("user's categories", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid()
                       = user_id)`,
			withCheck: sql`(auth.uid()
                           = user_id)`,
		}),
	],
);
