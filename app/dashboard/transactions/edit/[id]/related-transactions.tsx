import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function RelatedTransactions(props: {
  description: string;
  existingTransactionId: string;
}) {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .order("datetime", { ascending: false })
    .eq("description", props.description)
    .neq("id", props.existingTransactionId)
    .returns<TransactionWithRecurring[]>();

  if (!transactions || transactions?.length === 0) {
    return;
  }

  return <TransactionList transactions={transactions ?? []} />;
}
