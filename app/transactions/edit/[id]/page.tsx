import TransactionForm from "@/components/transactions/components/transaction-form";
import { Transaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: transaction } = await createClient()
    .from("transactions")
    .select("*")
    .eq("id", params.id)
    .returns<Transaction>()
    .single();

  if (transaction) {
    return <TransactionForm transaction={transaction} />;
  }

  return <TransactionForm />;
}
