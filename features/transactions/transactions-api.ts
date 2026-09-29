"use server";
import { addYears, endOfMonth, format, startOfMonth, startOfYear } from "date-fns";
import { and, asc, between, desc, eq, gte, ilike, lt, lte, or, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import { getActiveAccountId } from "@/features/account/account-actions";
import { calculateNextRun } from "@/features/transactions/recurring/recurring-transactions-calculator";
import { dbTransaction } from "@/drizzle/client";
import type { RecurringInterval, TransactionType } from "@/drizzle/schema";
import { categories } from "@/drizzle/schema/categories";
import {
	type TransactionWithRecurringCategory,
	transactionsRecurring,
} from "@/drizzle/schema/transaction-recurring-schema";
import { transactions } from "@/drizzle/schema/transaction-schema";

export async function makeTransactionRecurring(
	transaction: TransactionWithRecurringCategory,
	interval: RecurringInterval,
) {
	try {
		await dbTransaction(async (tx) => {
			const [recurring] = await tx
				.insert(transactionsRecurring)
				.values({
					id: transaction.recurringTransaction ? transaction.recurringTransaction.id : undefined,
					amount: transaction.amount,
					description: transaction.description,
					categoryId: transaction.category.id,
					nextRun: format(calculateNextRun(transaction.datetime, interval), "yyyy-MM-dd"),
					type: transaction.type,
					interval,
					userId: transaction.userId,
				})
				.onConflictDoUpdate({
					target: transactionsRecurring.id,
					set: {
						amount: transaction.amount,
						description: transaction.description,
						categoryId: transaction.category ? transaction.category.id : undefined,
						nextRun: format(calculateNextRun(transaction.datetime, interval), "yyyy-MM-dd"),
						type: transaction.type,
						interval,
					},
				})
				.returning({ id: transactionsRecurring.id });

			await tx
				.update(transactions)
				.set({ recurringTransactionId: recurring.id })
				.where(eq(transactions.id, transaction.id));
		});

		revalidatePath("transactions");
	} catch (error) {
		console.error(error);
	}
}

export async function upsertTransaction(newTransaction: typeof transactions.$inferInsert) {
	try {
		await dbTransaction(async (tx) => {
			if (newTransaction.id) {
				await tx
					.update(transactions)
					.set(newTransaction)
					.where(eq(transactions.id, newTransaction.id));
			} else {
				await tx.insert(transactions).values(newTransaction);
			}

			return { success: true };
		});

		revalidatePath("/");
		return { error: null, success: true };
	} catch (error) {
		return { error, success: false };
	}
}

export async function insertTransaction(newTransaction: typeof transactions.$inferInsert) {
	await dbTransaction((tx) => {
		return tx.insert(transactions).values(newTransaction);
	});
}

export const searchTransactions = async (filter: SearchFilter) => {
	const sortableColumns = {
		datetime: transactions.datetime,
		amount: transactions.amount,
		description: transactions.description,
		type: transactions.type,
	} as const;

	const sortColumn =
		sortableColumns[(filter.sortBy as keyof typeof sortableColumns) ?? "datetime"] ??
		transactions.datetime;
	const sortFn = filter.sortDirection === "asc" ? asc : desc;

	return dbTransaction(async (tx) => {
		const amountMin = filter.amountMin ? Number(filter.amountMin) : undefined;
		const amountMax = filter.amountMax ? Number(filter.amountMax) : undefined;

		const activeAccountId = await getActiveAccountId();

		const conditions = [
			filter.category ? eq(categories.name, filter.category) : undefined,
			filter.dateFrom ? gte(transactions.datetime, filter.dateFrom) : undefined,
			filter.dateTo ? lte(transactions.datetime, filter.dateTo) : undefined,
			Number.isFinite(amountMin) ? gte(transactions.amount, amountMin as number) : undefined,
			Number.isFinite(amountMax) ? lte(transactions.amount, amountMax as number) : undefined,
			filter.description ? ilike(transactions.description, `%${filter.description}%`) : undefined,
			filter.type ? eq(transactions.type, filter.type) : undefined,
			eq(transactions.accountId, activeAccountId),
		].filter((c): c is NonNullable<typeof c> => c !== undefined);

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
			.where(conditions.length ? and(...conditions) : undefined)
			.orderBy(sortFn(sortColumn))
			.limit(200);

		return rows.map(({ transaction, category, recurringTransaction }) => ({
			...transaction,
			category,
			recurringTransaction: recurringTransaction,
		}));
	});
};

export const deleteTransaction = async (id: string) => {
	return dbTransaction((tx) => tx.delete(transactions).where(eq(transactions.id, id)));
};

export const deleteRecurringTransaction = async (id: string) => {
	try {
		await dbTransaction((tx) =>
			tx.delete(transactionsRecurring).where(eq(transactionsRecurring.id, id)),
		);
		revalidatePath("", "layout");
		return null;
	} catch (error) {
		console.error(error);
		return error;
	}
};

export async function updateRecurringTransaction(
	data: typeof transactionsRecurring.$inferInsert,
): Promise<{
	success: boolean;
	message?: string;
}> {
	try {
		await dbTransaction((tx) =>
			tx
				.update(transactionsRecurring)
				.set(data)
				.where(eq(transactionsRecurring.id, data.id ?? "")),
		);

		revalidatePath("/");
		return { success: true, message: "Transaction updated successfully" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to update transaction" };
	}
}

export async function getRecurringTransactionsForMonth(year: number, month: number) {
	const date = new Date(year, month, 1);
	const from = format(startOfMonth(date), "yyyy-MM-dd");
	const to = format(endOfMonth(date), "yyyy-MM-dd");

	const today = new Date();
	const isFutureMonth =
		year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());

	return await dbTransaction(async (tx) => {
		const activeAccountId = await getActiveAccountId();

		return tx
			.select()
			.from(transactionsRecurring)
			.where(
				and(
					eq(transactionsRecurring.accountId, activeAccountId),
					eq(transactionsRecurring.enabled, true),
					isFutureMonth
						? or(
								eq(transactionsRecurring.interval, "monthly"),
								and(
									eq(transactionsRecurring.interval, "annually"),
									between(transactionsRecurring.nextRun, from, to),
								),
							)
						: or(
								and(
									eq(transactionsRecurring.interval, "monthly"),
									lte(transactionsRecurring.nextRun, to),
								),
								and(
									eq(transactionsRecurring.interval, "annually"),
									between(transactionsRecurring.nextRun, from, to),
								),
							),
				),
			)
			.orderBy(transactionsRecurring.nextRun);
	});
}

export async function getTotalByTypeAndYear(
	transactionType: TransactionType,
	transactionYear: number,
) {
	const activeAccountId = await getActiveAccountId();

	const start = startOfYear(new Date(transactionYear, 0, 1));
	const end = addYears(start, 1);

	const [{ total }] = await dbTransaction((tx) =>
		tx
			.select({
				total: sum(transactions.amount),
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.accountId, activeAccountId),
					eq(transactions.type, transactionType),
					gte(transactions.datetime, start.toISOString()),
					lt(transactions.datetime, end.toISOString()),
				),
			),
	);

	return total !== null ? Number(total) : null;
}
