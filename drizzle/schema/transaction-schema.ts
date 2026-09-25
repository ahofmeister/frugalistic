import { sql } from "drizzle-orm";
import {
	check,
	date,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgPolicy,
	pgTable,
	text,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { categories } from "@/drizzle/schema/categories";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
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
		id,
		createdAt,
		updatedAt,
		userId,
		accountId: uuid("account_id").default(sql`public.active_account_id()`).notNull(),
		description: varchar().notNull(),
		datetime: date().notNull(),
		amount: integer().notNull(),
		type: transactionTypeEnum("type").notNull(),
		categoryId: uuid("category_id").notNull(),
		recurringTransactionId: uuid("recurring_transaction_id"),
		costType: costTypeEnum("cost_type").notNull().default("variable"),
		externalId: text("external_id"),
	},
	(table) => [
		index("transactions_account_id_idx").on(table.accountId),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "transactions_category_fkey",
		}),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "categories_account_id_fkey",
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
		pgPolicy("account members can select", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
			)`,
		}),
		pgPolicy("account write members can manage rows", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
			withCheck: sql`EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)`,
		}),
		check(
			"disallow_empty",
			sql`(description)
                ::text <> ''::text`,
		),
	],
);
