import { createClient } from "@/utils/supabase/server";
import {
  Category,
  FavoriteWithCategory,
  TransactionWithRecurring,
} from "@/types";
import TransactionForm from "@/components/transactions/components/transaction-form";
import React from "react";

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

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*, recurring_transaction(*)")
    .eq("id", id || "")
    .returns<TransactionWithRecurring[]>()
    .single();

  return (
    <TransactionForm
      transaction={transaction ?? undefined}
      favorites={favorites ?? []}
      autoSuggests={autoSuggests ?? []}
      categories={categories ?? []}
    />
  );
};
