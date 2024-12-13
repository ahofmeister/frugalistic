import { notFound } from "next/navigation";

import { RecurringTransactionHistory } from "@/app/dashboard/recurring/[id]/recurring-transaction-history";
import RecurringTransactionForm from "@/components/transactions/recurring/components/recurring-transaction-form";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: transaction } = await supabase
    .from("transactions_recurring")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!transaction) {
    notFound();
  }

  return (
    <div>
      <RecurringTransactionForm transaction={transaction} />
      <div className="mt-6 mx-auto max-w-lg">
        <RecurringTransactionHistory recurringTransactionId={transaction.id} />
      </div>
    </div>
  );
}
