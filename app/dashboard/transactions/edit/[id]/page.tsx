import TransactionForm from "@/components/transactions/components/transaction-form";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage({
  params,
}: {
  params: { id: string };
}) {
  const transactionClient = createClient("transactions");
  const { data: transaction } = await transactionClient
    .from("transactions")
    .select("*, recurring_transaction(interval)")
    .eq("id", params.id)
    .returns<TransactionWithRecurring>()
    .single();

  const autoSuggestClient = createClient();
  const { data: autoSuggests } = await autoSuggestClient
    .from("transaction_auto_suggest2")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  return (
    <TransactionForm
      transaction={transaction ?? undefined}
      autoSuggests={autoSuggests ?? []}
    />
  );
}
