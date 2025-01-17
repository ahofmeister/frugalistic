import { notFound } from "next/navigation";

import TransactionForm from "@/components/transactions/components/transaction-form";
import { Category, TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: transaction } = await supabase
    .from("transactions")
    .select("*, recurring_transaction(interval)")
    .eq("id", params.id)
    .returns<TransactionWithRecurring>()
    .single();

  if (!transaction) {
    notFound();
  }

  const { data: autoSuggests } = await supabase
    .from("transaction_auto_suggest2")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .returns<Category[]>();

  return (
    <TransactionForm
      transaction={transaction ?? undefined}
      autoSuggests={autoSuggests ?? []}
      categories={categories ?? []}
    />
  );
}
