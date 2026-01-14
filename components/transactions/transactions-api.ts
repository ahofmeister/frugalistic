"use server";
import { format } from "date-fns";
import { revalidatePath, revalidateTag } from "next/cache";

import { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import {
  NewTransaction,
  RecurringInterval,
  TransactionWithRecurring,
  UpdateRecurringTransaction,
} from "@/types";
import { createClient } from "@/utils/supabase/server";
import { transactionSchema } from "@/db/migrations/schema";
import { dbTransaction } from "@/db";
import { calculateNextRun } from "@/components/transactions/recurring/recurring-transactions-calculator";

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
  revalidateTag("transactions", { expire: 10 });
}

export async function upsertTransaction(newTransaction: NewTransaction) {
  const supabase = await createClient();

  revalidatePath("/");
  return await supabase.from("transactions").upsert(newTransaction);
}

export async function insertTransaction(
  newTransaction: typeof transactionSchema.$inferInsert,
) {
  await dbTransaction((tx) => {
    return tx.insert(transactionSchema).values(newTransaction);
  });
}

export const searchTransactions = async (
  filter: SearchFilter,
): Promise<TransactionWithRecurring[]> => {
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

export async function updateRecurringTransaction(
  data: UpdateRecurringTransaction,
): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("transactions_recurring")
      .update(data)
      .eq("id", data.id!);

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
