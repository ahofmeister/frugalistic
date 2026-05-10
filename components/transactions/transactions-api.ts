"use server";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { and, between, eq, lte, notExists, or, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import { calculateNextRun } from "@/components/transactions/recurring/recurring-transactions-calculator";
import { dbTransaction } from "@/db";
import {
	type TransactionWithRecurringCategory,
	transactionSchema,
	transactionsRecurring,
} from "@/db/migrations/schema";
import type { NewTransaction, RecurringInterval, UpdateRecurringTransaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function makeTransactionRecurring(
	transaction: TransactionWithRecurringCategory,
	interval: RecurringInterval,
) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("transactions_recurring")
		.upsert({
			id: transaction.recurringTransaction ? transaction.recurringTransaction.id : undefined,
			amount: transaction.amount,
			description: transaction.description,
			category: transaction.category ? transaction.category.id : undefined,
			next_run: format(calculateNextRun(transaction.datetime, interval), "yyyy-MM-dd"),
			type: transaction.type,
			interval: interval,
			user_id: transaction.userId,
		})
		.select("id")
		.single();

	if (data) {
		const supabase = await createClient();
		const { error } = await supabase
			.from("transactions")
			.update({
				recurring_transaction: data.id,
			})
			.eq("id", transaction.id);
		if (error) {
			console.log(error);
		}
	}

	if (error) {
		console.log(error);
	}
	revalidateTag("transactions", { expire: 10 });
}

export async function upsertTransaction(newTransaction: NewTransaction) {
	try {
		await dbTransaction(async (tx) => {
			if (newTransaction.id) {
				await tx
					.update(transactionSchema)
					.set(newTransaction)
					.where(eq(transactionSchema.id, newTransaction.id));
			} else {
				await tx.insert(transactionSchema).values(newTransaction);
			}

			return { success: true };
		});

		revalidatePath("/");
		return { error: null, success: true };
	} catch (error) {
		return { error, success: false };
	}
}

export async function insertTransaction(newTransaction: typeof transactionSchema.$inferInsert) {
	await dbTransaction((tx) => {
		return tx.insert(transactionSchema).values(newTransaction);
	});
}

export const searchTransactions = async (
	filter: SearchFilter,
): Promise<TransactionWithRecurringCategory[]> => {
	const supabase = await createClient();

	const query = filter.category
		? supabase
				.from("transactions")
				.select(
					"id, description, amount, datetime, type, category!inner(name, color), recurring_transaction(*)",
				)
		: supabase
				.from("transactions")
				.select(
					"id, description, amount, datetime, type, category(name, color), recurring_transaction(*)",
				);

	if (filter.category) {
		query.eq("category.name", filter.category);
	}

	if (filter.dateFrom) {
		query.gte("datetime", filter.dateFrom);
	}

	if (filter.dateTo) {
		query.lte("datetime", filter.dateTo);
	}

	if (filter.amountMin) {
		query.gte("amount", filter.amountMin);
	}

	if (filter.amountMax) {
		query.lte("amount", filter.amountMax);
	}

	if (filter.description) {
		query.ilike("description", `%${filter.description}%`);
	}

	if (filter.type) {
		query.eq("type", filter.type);
	}
	query.order(filter.sortBy ?? "datetime", {
		ascending: filter.sortDirection === "asc",
	});

	query.limit(200);
	const { data } = await query.returns<TransactionWithRecurringCategory[]>();
	return data ?? [];
};

export const deleteTransaction = async (id: string) => {
	const supabase = await createClient();
	return supabase.from("transactions").delete().eq("id", id);
};

export const deleteRecurringTransaction = async (id: string) => {
	const supabase = await createClient();
	const { error } = await supabase.from("transactions_recurring").delete().eq("id", id).single();
	revalidatePath("", "layout");
	return error;
};

export async function updateRecurringTransaction(data: UpdateRecurringTransaction): Promise<{
	success: boolean;
	message?: string;
}> {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("transactions_recurring")
			.update(data)
			.eq("id", data.id ?? "");

		if (error) {
			console.error(error);
			return { success: false, message: "Failed to update transaction" };
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
		return tx
			.select()
			.from(transactionsRecurring)
			.where(
				and(
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
