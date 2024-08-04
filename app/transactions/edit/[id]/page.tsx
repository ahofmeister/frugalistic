import TransactionForm from "@/components/transactions/components/transaction-form";
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
    .single();

  return <TransactionForm transaction={transaction} />;
}
