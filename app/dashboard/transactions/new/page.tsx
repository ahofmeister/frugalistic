import TransactionForm from "@/components/transactions/components/transaction-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewTransactionPage() {
  const supabase = await createClient();

  const { data: list } = await supabase
    .from("transaction_auto_suggest2")
    .select("*")
    .order("frequency", { ascending: false })
    .order("description", { ascending: true });

  return <TransactionForm autoSuggests={list ?? []} />;
}
