import { createClient } from "@/utils/supabase/server";
import { Category, FavoriteWithCategory } from "@/types";
import TransactionForm from "@/components/transactions/components/transaction-form";
import React from "react";
import { dbTransaction } from "@/db";
import {
  transactionSchema,
  transactionsRecurring,
} from "@/db/migrations/schema";
import { eq } from "drizzle-orm";

export const TransactionFormData = async ({
  transactionId,
}: {
  transactionId?: Promise<string>;
}) => {
  const supabase = await createClient();

  const id = await transactionId;

  const { data: autoSuggests } = await supabase
    .from("transaction_auto_suggest")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .returns<Category[]>();

  const { data: favorites } = await supabase
    .from("favorite")
    .select("*, category(*)")
    .order("description")
    .returns<FavoriteWithCategory[]>();

  const [transaction] = id
    ? await dbTransaction(async (tx) => {
        const rows = await tx
          .select()
          .from(transactionSchema)
          .leftJoin(
            transactionsRecurring,
            eq(
              transactionSchema.recurringTransaction,
              transactionsRecurring.id,
            ),
          )
          .where(eq(transactionSchema.id, id || ""))
          .limit(1);
        return rows.map((row) => ({
          ...row.transactions,
          recurring_transaction: row.transactions_recurring,
        }));
      })
    : [];

  return (
    <TransactionForm
      transaction={transaction}
      favorites={favorites ?? []}
      autoSuggests={autoSuggests ?? []}
      categories={categories ?? []}
    />
  );
};
