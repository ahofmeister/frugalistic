import { sql } from "drizzle-orm";
import { foreignKey, pgPolicy, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "@/drizzle/schema/users-schema";

export const profiles = pgTable(
	"profile",
	{
		id: uuid().default(sql`auth.uid()`).primaryKey().notNull(),
		firstName: text(),
		lastName: text(),
		email: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey",
		}).onDelete("cascade"),
		unique("user_id_key").on(table.id),
		unique("user_email_key").on(table.email),
		pgPolicy("user's profile", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid()
                       = id)`,
			withCheck: sql`(auth.uid()
                           = id)`,
		}),
	],
);
