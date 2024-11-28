import TransactionForm from "@/components/transactions/components/transaction-form";
import { Transaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", params.id)
    .returns<Transaction>()
    .single();

  const { data: autoSuggests } = await supabase
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
