import { notFound } from "next/navigation";

import RecurringTransactionForm from "@/components/transactions/recurring/components/recurring-transaction-form";
import { Transaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: transaction } = await supabase
    .from("transactions_recurring")
    .select("*")
    .eq("id", params.id)
    .returns<Transaction>()
    .single();

  if (!transaction) {
    notFound();
  }

  return <RecurringTransactionForm transaction={transaction} />;
}
