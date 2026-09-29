import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	check,
	date,
	doublePrecision,
	foreignKey,
	index,
	numeric,
	pgPolicy,
	pgTable,
	pgView,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import { accountId, createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
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
		id,
		createdAt,
		updatedAt,
		userId,
		accountId,
		description: varchar().notNull(),
		nextRun: date("next_run"),
		amount: doublePrecision().notNull(),
		type: text("type").$type<TransactionType>().notNull(),
		enabled: boolean().default(true).notNull(),
		interval: text().$type<RecurringInterval>().notNull(),
		categoryId: uuid("category_id").notNull(),
	},
	(table) => [
		index("transactions_recurring_account_id_idx").on(table.accountId),
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
		check(
			"disallow_empty",
			sql`(description)
			    ::text <> ''::text`,
		),
	],
);

export const transactionAutoSuggest = pgView("transaction_auto_suggest", {
	uniqueId: bigint("unique_id", { mode: "number" }),
	accountId: uuid("account_id"),
	description: text(),
	type: text("type").$type<TransactionType>(),
	category: uuid(),
	name: text(),
	color: text(),
	frequency: numeric(),
})
	.with({ securityInvoker: true })
	.as(sql`WITH category_counts AS (
  SELECT t.account_id,
         TRIM(BOTH FROM t.description) AS description,
         t.type,
         c.id AS category,
         c.name,
         c.color,
         count(*) AS frequency,
         row_number() OVER (
           PARTITION BY t.account_id, TRIM(BOTH FROM t.description), t.type
           ORDER BY count(*) DESC, max(t.updated_at) DESC, c.id
         ) AS rn
  FROM transactions t
  JOIN categories c ON c.id = t.category_id AND c.account_id = t.account_id
  WHERE t.account_id = public.active_account_id()
  GROUP BY t.account_id, TRIM(BOTH FROM t.description), t.type, c.id, c.name, c.color
),
totals AS (
  SELECT account_id, description, type, sum(frequency) AS total_frequency
  FROM category_counts
  GROUP BY account_id, description, type
)
	SELECT row_number() OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id,
		cc.account_id,
		   cc.description,
		   cc.type,
		   cc.category,
		   cc.name,
		   cc.color,
		   t.total_frequency AS frequency
	FROM category_counts cc
			 JOIN totals t ON cc.account_id = t.account_id
		AND cc.description = t.description
		AND cc.type = t.type
	WHERE cc.rn = 1
	ORDER BY t.total_frequency DESC, cc.description`);
