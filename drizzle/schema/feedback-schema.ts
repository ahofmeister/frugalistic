import { sql } from "drizzle-orm";
import { check, foreignKey, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
import { users } from "@/drizzle/schema/users-schema";

export const feedbackStatuses = ["New", "In Progress", "Resolved", "Closed"] as const;
export type FeedBackStatus = (typeof feedbackStatuses)[number];

export const feedback = pgTable(
	"feedback",
	{
		id,
		createdAt,
		updatedAt,
		userId,
		text: text().notNull(),
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
