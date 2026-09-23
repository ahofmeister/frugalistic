import { sql } from "drizzle-orm";
import {
	check,
	date,
	foreignKey,
	integer,
	pgEnum,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/drizzle/schema/categories";
import { transactionsRecurring } from "@/drizzle/schema/transaction-recurring-schema";
import { users } from "@/drizzle/schema/users-schema";

export const costTypes = ["fixed", "variable"] as const;
export type CostType = (typeof costTypes)[number];

export const transactionTypes = ["income", "expense", "savings"] as const;
export type TransactionType = (typeof transactionTypes)[number];
export type TransactionTypeWithLeftover = TransactionType | "leftover";

export const transactionTypeEnum = pgEnum("transaction_type", transactionTypes);
export const costTypeEnum = pgEnum("cost_type", costTypes);

export const transactions = pgTable(
	"transactions",
	{
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		description: varchar().notNull(),
		datetime: date().notNull(),
		userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
		amount: integer().notNull(),
		type: transactionTypeEnum("type").notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		categoryId: uuid("category_id").notNull(),
		recurringTransactionId: uuid("recurring_transaction_id"),
		costType: costTypeEnum("cost_type").notNull().default("variable"),
		externalId: text("external_id"),
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
		uniqueIndex("transactions_user_external_id_idx")
			.on(table.userId, table.externalId)
			.where(sql`external_id IS NOT NULL`),
		pgPolicy("user's transaction only", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
	],
);
