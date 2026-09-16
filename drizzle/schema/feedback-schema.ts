import { sql } from "drizzle-orm";
import { check, foreignKey, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { costTypes } from "@/drizzle/schema/transaction-schema";
import { users } from "@/drizzle/schema/users-schema";

export const feedbackStatuses = ["New", "In Progress", "Resolved", "Closed"] as const;
export type FeedBackStatus = (typeof feedbackStatuses)[number];

export const feedback = pgTable(
	"feedback",
	{
		id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		text: text().notNull(),
		createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
		status: text().$type<FeedBackStatus>().default("New"),
		response: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "feedback_user_id_fkey",
		}).onDelete("cascade"),
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
		check(
			"feedback_status_check",
			sql`status
            = ANY (ARRAY['New'::text, 'In Progress'::text, 'Resolved'::text, 'Closed'::text])`,
		),
	],
);
