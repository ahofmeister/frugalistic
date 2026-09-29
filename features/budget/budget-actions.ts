"use server";

import { endOfMonth, endOfYear, format, parseISO, startOfMonth, startOfYear } from "date-fns";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getActiveAccountId } from "@/features/account/account-actions";
import { dbTransaction } from "@/drizzle/client";
import { budgetSchema, categories, transactions, transactionsRecurring } from "@/drizzle/schema";

function normalizeBudgetDates(
	type: typeof budgetSchema.$inferInsert.type,
	startDate: string,
	targetDate?: string | null,
) {
	const start = parseISO(startDate);

	if (type === "month") {
		return {
			startDate: format(startOfMonth(start), "yyyy-MM-dd"),
			targetDate: targetDate ? format(endOfMonth(parseISO(targetDate)), "yyyy-MM-dd") : null,
		};
	}

	if (type === "year") {
		return {
			startDate: format(startOfYear(start), "yyyy-MM-dd"),
			targetDate: targetDate ? format(endOfYear(parseISO(targetDate)), "yyyy-MM-dd") : null,
		};
	}

	return {
		startDate,
		targetDate,
	};
}

export async function createBudget(newBudget: typeof budgetSchema.$inferInsert) {
	const dates = normalizeBudgetDates(newBudget.type, newBudget.startDate, newBudget.targetDate);

	await dbTransaction((tx) => {
		return tx.insert(budgetSchema).values({
			...newBudget,
			...dates,
			amount: newBudget.amount * 100,
		});
	});

	revalidatePath("budgets");
}

export async function deleteBudget(id: string) {
	try {
		await dbTransaction((tx) => {
			return tx.delete(budgetSchema).where(eq(budgetSchema.id, id));
		});
	} catch (e) {
		console.error(e);
	}

	revalidatePath("budgets");
}

export async function findBudgetById(budgetId: string) {
	const activeAccountId = await getActiveAccountId();

	return await dbTransaction((tx) => {
		return tx.query.budgetSchema.findFirst({
			where: {
				id: budgetId,
				accountId: activeAccountId,
			},
			with: {
				category: true,
			},
		});
	});
}

export async function findBudgetTotals(categoryId: string, from: string, to: string | null) {
	const accountId = await getActiveAccountId();

	const rows = await dbTransaction((tx) =>
		tx
			.select({
				type: transactions.type,
				total: sql<number>`coalesce(sum(${transactions.amount}), 0)::int`,
			})
			.from(transactions)
			.where(budgetConditions(accountId, categoryId, from, to))
			.groupBy(transactions.type),
	);

	const totals = { expense: 0, income: 0, savings: 0 };

	for (const row of rows) {
		totals[row.type] = row.total;
	}

	return totals;
}

export async function findBudgetTransactions(categoryId: string, from: string, to: string | null) {
	const accountId = await getActiveAccountId();

	return dbTransaction(async (tx) => {
		const rows = await tx
			.select({
				transaction: transactions,
				category: categories,
				recurringTransaction: transactionsRecurring,
			})
			.from(transactions)
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.leftJoin(
				transactionsRecurring,
				eq(transactions.recurringTransactionId, transactionsRecurring.id),
			)
			.where(budgetConditions(accountId, categoryId, from, to))
			.orderBy(desc(transactions.datetime), desc(transactions.createdAt));

		return rows.map(({ transaction, category, recurringTransaction }) => ({
			...transaction,
			category,
			recurringTransaction,
		}));
	});
}

function budgetConditions(accountId: string, categoryId: string, from: string, to: string | null) {
	return and(
		eq(transactions.categoryId, categoryId),
		eq(transactions.accountId, accountId),
		gte(transactions.datetime, from),
		to ? lte(transactions.datetime, to) : undefined,
	);
}
