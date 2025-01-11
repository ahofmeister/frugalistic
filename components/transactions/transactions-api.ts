"use server";
import { addMonths, addYears, format } from "date-fns";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  NewTransaction,
  RecurringInterval,
  TransactionType,
  TransactionWithRecurring,
} from "@/types";
import { createClient } from "@/utils/supabase/server";

const calculateNextRun = (
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
  transaction: TransactionWithRecurring,
  interval: RecurringInterval,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions_recurring")
    .upsert({
      id: transaction.recurring_transaction
        ? transaction.recurring_transaction.id
        : undefined,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category ? transaction.category : undefined,
      next_run: format(
        calculateNextRun(transaction.datetime, interval),
        "yyyy-MM-dd",
      ),
      type: transaction.type,
      interval: interval,
      user_id: transaction.user_id,
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
  revalidateTag("transactions");
}

export async function upsertTransaction(newTransaction: NewTransaction) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").upsert(newTransaction);

  if (error) {
    console.log(error);
  }
}

export const searchTransactions = async ({
  dateFrom,
  dateTo,
  amountFrom,
  amountTo,
  description,
  category,
  type,
}: {
  dateFrom: string | undefined;
  amountFrom: string | undefined;
  amountTo: string | undefined;
  dateTo: string | undefined;
  description: string | undefined;
  category: string | undefined;
  type: TransactionType | undefined;
}): Promise<TransactionWithRecurring[]> => {
  const supabase = await createClient();

  const query = category
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
  if (category) {
    await query.eq("category.name", category);
  }

  if (dateFrom) {
    await query.gte("datetime", dateFrom);
  }

  if (dateTo) {
    await query.lte("datetime", dateTo);
  }

  if (amountFrom) {
    await query.gte("amount", amountFrom);
  }

  if (amountTo) {
    await query.lte("amount", amountTo);
  }

  if (description) {
    await query.ilike("description", `%${description}%`);
  }

  if (type) {
    await query.eq("type", type);
  }

  await query.order("datetime", { ascending: false });

  if (!dateFrom && !dateTo && !description && !type && !category && !type) {
    await query.limit(50);
  }
  const { data } = await query.returns<TransactionWithRecurring[]>();
  return data ?? [];
};

export const toggleEnabledRecurringTransaction = async (
  id: string,
  newStatus: boolean,
) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions_recurring")
    .update({ enabled: newStatus })
    .eq("id", id);
  revalidatePath(`/`);
  return error;
};

export const deleteTransaction = async (id: string) => {
  const supabase = await createClient();
  return supabase.from("transactions").delete().eq("id", id);
};

export const deleteRecurringTransaction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions_recurring")
    .delete()
    .eq("id", id)
    .single();
  revalidatePath(`/`);
  return error;
};
