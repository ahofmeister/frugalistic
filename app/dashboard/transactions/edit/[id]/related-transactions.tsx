import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function RelatedTransactions(props: { description: string }) {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .order("datetime", { ascending: false })
    .eq("description", props.description)
    .returns<TransactionWithRecurring[]>();

  return <TransactionList transactions={transactions ?? []} />;
}
