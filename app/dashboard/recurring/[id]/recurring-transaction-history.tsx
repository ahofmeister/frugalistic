import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function RecurringTransactionHistory(props: {
  recurringTransactionId: string;
}) {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .eq("recurring_transaction", props.recurringTransactionId)
    .order("datetime", { ascending: false })
    .returns<TransactionWithCategory[]>();
  return (
    <div>
      <div className="text-lg mb-2">Transaction History</div>
      <TransactionList transactions={transactions ?? []} />
    </div>
  );
}
