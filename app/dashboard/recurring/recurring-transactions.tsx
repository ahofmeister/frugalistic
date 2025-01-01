import React from "react";

import RecurringTransactionCard from "@/app/dashboard/recurring/recurring-transaction-card";
import { createClient } from "@/utils/supabase/server";

const RecurringTransactions = async () => {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions_recurring")
    .select()
    .order("enabled", { ascending: false });

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold mb-4">Recurring Transactions</div>
      <div className="flex flex-col gap-y-2">
        {transactions?.map((transaction) => (
          <RecurringTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </div>
  );
};

export default RecurringTransactions;
