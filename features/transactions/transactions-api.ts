"use server";
import { addYears, endOfMonth, format, startOfMonth, startOfYear } from "date-fns";
import { and, asc, desc, eq, gte, ilike, lt, lte, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import { dbTransaction } from "@/drizzle/client";
import type { TransactionType } from "@/drizzle/schema";
import { categories } from "@/drizzle/schema/categories";
import { transactionsRecurring } from "@/drizzle/schema/transaction-recurring-schema";
import { transactions } from "@/drizzle/schema/transaction-schema";
import { getActiveAccountId } from "@/features/account/account-actions";

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

export async function upsertRecurringTransaction(
	data: typeof transactionsRecurring.$inferInsert,
): Promise<{
	success: boolean;
	message?: string;
}> {
	try {
		const id = data.id;

		if (id) {
			await dbTransaction((tx) =>
				tx
					.update(transactionsRecurring)
					.set({ ...data, nextRun: data.startDate })
					.where(eq(transactionsRecurring.id, id)),
			);
		} else {
			await dbTransaction((tx) => {
				return tx.insert(transactionsRecurring).values(data);
			});
		}

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

		return tx.query.transactionsRecurring.findMany({
			where: {
				accountId: activeAccountId,
				enabled: true,
				OR: [
					isFutureMonth ? { interval: "monthly" } : { interval: "monthly", nextRun: { lte: to } },
					{
						interval: "annually",
						nextRun: { gte: from, lte: to },
					},
				],
			},
			with: {
				category: true,
			},
			orderBy: { nextRun: "asc" },
		});
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

export async function bookTransaction(id: string) {
	try {
		await dbTransaction((tx) => {
			return tx
				.update(transactions)
				.set({
					status: "booked",
				})
				.where(eq(transactions.id, id));
		});
		revalidatePath("/", "layout");
		return { success: true, message: "Book transaction successfully" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to book transaction" };
	}
}

export async function declinePlannedTransaction(id: string) {
	try {
		await dbTransaction((tx) => {
			return tx.delete(transactions).where(eq(transactions.id, id));
		});
		revalidatePath("/", "layout");
		return { success: true, message: "Planned transaction declined" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to declined planned transaction" };
	}
}
