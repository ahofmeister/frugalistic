"use server";
import { addMonths, addYears, format } from "date-fns";

import {
  NewRecurringTransaction,
  NewTransaction,
  RecurringInterval,
  RecurringTransaction,
  TransactionWithCategory,
} from "@/types";
import { createClient } from "@/utils/supabase/server";

const calcNextRun = (
  date: string,
  recurringInterval: "monthly" | "annually",
): Date => {
  const currentRun = new Date(date);

  switch (recurringInterval) {
    case "monthly":
      return addMonths(currentRun, 1);
    case "annually":
      return addYears(currentRun, 1);
  }
};

export async function makeTransactionRecurring(
  transaction: TransactionWithCategory,
  interval: RecurringInterval,
) {
  const { data: response } = await createClient().auth.getUser();
  // TODO user id should be necessary
  if (!response) {
    return;
  }

  const { error } = await createRecurring({
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category ? transaction.category.id : undefined,
    next_run: format(calcNextRun(transaction.datetime, interval), "yyyy-MM-dd"),
    type: transaction.type,
    interval: interval,
    user_id: response.user!.id,
  });

  if (error) {
    console.log(error);
  }
}

export async function upsertTransaction(newTransaction: NewTransaction) {
  const supabase = createClient();

  const { error } = await supabase.from("transactions").upsert(newTransaction);

  if (error) {
    console.log(error);
  }
}

const createRecurring = async (t: NewRecurringTransaction) => {
  return createClient().from("transactions_recurring").insert(t);
};

export const searchTransactions = async ({
  dateFrom,
  dateTo,
  description,
  category,
}: {
  dateFrom: string | undefined;
  dateTo: string | undefined;
  description: string | undefined;
  category: string | undefined;
}): Promise<TransactionWithCategory[]> => {
  const supabase = createClient();

  const query = supabase
    .from("transactions")
    .select(
      "id, description, amount, datetime, type, category!inner(name, division, color)",
    );

  if (category) {
    await query.eq("category.name", category);
  }

  if (dateFrom) {
    await query.gte("datetime", dateFrom);
  }

  if (dateTo) {
    await query.lte("datetime", dateTo);
  }

  if (description) {
    await query.ilike("description", `%${description}%`);
  }

  await query.order("datetime", { ascending: false });

  if (!dateFrom && !dateTo && !description) {
    await query.limit(50);
  }
  const { data } = await query.returns<TransactionWithCategory[]>();
  return data ?? [];
};

export type TransactionTotal = {
  month: number;
  income: number;
  expense: number;
  savings: number;
};

export type TransactionTotalByMonth = {
  total: number;
  category_name: string;
  category_color: string;
  month: number;
};

export const getTotalByCategory = async ({
  year,
}: {
  year: number;
}): Promise<TransactionTotalByMonth[]> => {
  const supabase = createClient();

  const { data } = await supabase
    .rpc("transaction_categories_total", { year: year })
    .select("*")
    .returns<TransactionTotalByMonth[]>()
    .order("month")
    .order("total", { ascending: false });

  return data ?? [];
};

export const getTransactionsTotal = async ({
  year,
}: {
  year?: number;
}): Promise<TransactionTotal[]> => {
  const supabase = createClient();

  const query = supabase
    .rpc("transaction_type_total", { year: year! })
    .select();

  const { data } = await query.returns<TransactionTotal[]>().order("month");

  return data ?? [];
};

export const deleteTransaction = async (id: string) => {
  const supabase = createClient();
  await supabase.from("transactions").delete().eq("id", id);
};

export const invokeRecurringTransactions = async () => {
  await createClient().rpc("insert_recurring_transaction");
};

export async function upsertRecurringTransaction(
  newTransaction: RecurringTransaction,
) {
  const supabase = createClient();

  const { error } = await supabase.from("transactions_recurring").upsert({
    ...newTransaction,
  });

  if (error) {
    console.log(error);
  }
}
