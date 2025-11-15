import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/app/dashboard/settings/settings-actions";

export async function RelatedTransactions(props: { id: Promise<string> }) {
  const supabase = await createClient();

  const id = await props.id;

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (!transaction) {
    return;
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*), recurring_transaction(*)")
    .order("datetime", { ascending: false })
    .eq("description", transaction.description)
    .neq("id", transaction.id)
    .returns<TransactionWithRecurring[]>();

  if (!transactions || transactions?.length === 0) {
    return;
  }

  const settings = await getSettings();

  return (
    <TransactionList
      transactions={transactions ?? []}
      dateFormat={settings.date_format}
    />
  );
}
