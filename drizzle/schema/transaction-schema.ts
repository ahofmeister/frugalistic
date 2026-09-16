import { sql } from "drizzle-orm";
import {
	check,
	date,
	foreignKey,
	integer,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/category-schema";
import { transactionsRecurring } from "@/drizzle/schema/transaction-recurring-schema";
import { users } from "@/drizzle/schema/users-schema";

export const costTypes = ["fixed", "variable"] as const;
export type CostType = (typeof costTypes)[number];

export const transactionTypes = ["income", "expense", "savings"] as const;
export type TransactionType = (typeof transactionTypes)[number];
export type TransactionTypeWithLeftover = TransactionType | "leftover";

export const transactions = pgTable(
	"transactions",
	{
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		description: varchar().notNull(),
		datetime: date().defaultNow().notNull(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		amount: integer().notNull(),
		type: text("type").$type<TransactionType>().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		categoryId: uuid("category_id").notNull(),
		recurringTransactionId: uuid("recurring_transaction_id"),
		costType: text("cost_type").$type<CostType>().notNull().default("variable"),
	},
	(table) => [
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "transactions_category_fkey",
		}),
		foreignKey({
			columns: [table.recurringTransactionId],
			foreignColumns: [transactionsRecurring.id],
			name: "transactions_recurring_transaction_fkey",
		}).onDelete("set null"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transactions_user_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("user's transaction only", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid()
                       = user_id)`,
			withCheck: sql`(auth.uid()
                           = user_id)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
		check(
			"cost_type_check",
			sql`${table.costType}
            IN ('fixed', 'variable') OR
            ${table.costType}
            IS
            NULL`,
		),
	],
);
