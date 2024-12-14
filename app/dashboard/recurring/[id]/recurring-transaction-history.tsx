import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function RecurringTransactionHistory(props: {
  recurringTransactionId: string;
}) {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .eq("recurring_transaction", props.recurringTransactionId)
    .order("datetime", { ascending: false })
    .returns<TransactionWithRecurring[]>();
  return (
    <div>
      <div className="text-lg mb-2">Transaction History</div>
      <TransactionList transactions={transactions ?? []} />
    </div>
  );
}
