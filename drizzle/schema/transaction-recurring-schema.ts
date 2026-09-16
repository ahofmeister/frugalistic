import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	check,
	date,
	doublePrecision,
	foreignKey,
	numeric,
	pgPolicy,
	pgTable,
	pgView,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import type { TransactionType, transactions } from "@/drizzle/schema/transaction-schema";
import { users } from "@/drizzle/schema/users-schema";

export const recurringIntervals = ["monthly", "annually"] as const;
export type RecurringInterval = (typeof recurringIntervals)[number];

export type TransactionWithRecurringCategory = Omit<
	typeof transactions.$inferSelect,
	"category"
> & {
	recurringTransaction: typeof transactionsRecurring.$inferSelect | null;
	category: typeof categories.$inferSelect;
};

export const transactionsRecurring = pgTable(
	"transactions_recurring",
	{
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		description: varchar().notNull(),
		nextRun: date("next_run"),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		amount: doublePrecision().notNull(),
		type: text("type").$type<TransactionType>().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		enabled: boolean().default(true).notNull(),
		interval: text().$type<RecurringInterval>().notNull(),
		categoryId: uuid("category_id").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "transactions_recurring_category_fkey",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transactions_recurring_user_id_fkey",
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
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
	],
);

export const transactionAutoSuggest = pgView("transaction_auto_suggest", {
	uniqueId: bigint("unique_id", { mode: "number" }),
	description: text(),
	type: text("type").$type<TransactionType>(),
	category: uuid(),
	name: text(),
	color: text(),
	frequency: numeric(),
})
	.with({ securityInvoker: true })
	.as(sql`WITH category_counts
				 AS (SELECT TRIM(BOTH FROM t_1.description) AS description,
							t_1.type,
							c.id                            AS category,
							c.name,
							c.color,
							count(*)                        AS frequency,
							row_number()                       OVER (PARTITION BY (TRIM(BOTH FROM t_1.description)), t_1.type ORDER BY (count(*)) DESC) AS rn
					 FROM transactions t_1
							  JOIN categories c ON c.id = t_1.category
					 GROUP BY (TRIM(BOTH FROM t_1.description)), t_1.type, c.id,
							  c.name, c.color),
			 totals AS (SELECT category_counts.description,
							   category_counts.type,
							   sum(category_counts.frequency) AS total_frequency
						FROM category_counts
						GROUP BY category_counts.description, category_counts.type)
		SELECT row_number()         OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id, cc.description,
			   cc.type,
			   cc.category,
			   cc.name,
			   cc.color,
			   t.total_frequency AS frequency
		FROM category_counts cc
				 JOIN totals t ON cc.description = t.description AND cc.type = t.type
		WHERE cc.rn = 1
		ORDER BY t.total_frequency DESC, cc.description`);
