import { sql } from "drizzle-orm";
import { foreignKey, index, integer, pgPolicy, pgTable } from "drizzle-orm/pg-core";
import { date, text, uuid } from "drizzle-orm/pg-core/columns";
import { profiles } from "@/drizzle/schema/profile-schema";
import { createdAt, id, updatedAt, userId } from "@/drizzle/schema/schema-commons";
import type { RecurringInterval } from "@/drizzle/schema/transaction-recurring-schema";
import type { TransactionType } from "@/drizzle/schema/transaction-schema";
import { categories } from "./categories";

export const budgetTypes = ["recurring", "manual"] as const;
export type BudgetType = (typeof budgetTypes)[number];

export const budgetSchema = pgTable(
	"budget",
	{
		id: id,
		userId: userId,
		createdAt: createdAt,
		updatedAt: updatedAt,
		name: text("name"),
		categoryId: uuid("category_id").notNull(),
		type: text().$type<BudgetType>().notNull(),
		amount: integer().notNull(),
		flow: text().$type<TransactionType>().notNull(),
		interval: text().$type<RecurringInterval>(),
		startDate: date("start_date").notNull(),
		targetDate: date("target_date"),
	},
	(table) => [
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "budget_category_fkey",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "budget_user_id_fkey",
		}).onDelete("cascade"),
		index("budget_user_category_idx").on(table.userId, table.categoryId),
		pgPolicy("User can manage their budgets", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
);
