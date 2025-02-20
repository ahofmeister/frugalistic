import Link from "next/link";
import React from "react";

import RecurringTransactionCard from "@/app/dashboard/recurring/recurring-transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      {transactions?.length === 0 && (
        <Card className=" inset-0 gap-y-4 flex flex-col h-[240px] items-center justify-center  text-muted-foreground text-lg">
          No recurring transactions to display yet!
          <Link href="/dashboard/transactions/new">
            <Button variant="default">
              <div className="flex">New Transaction</div>
            </Button>
          </Link>
        </Card>
      )}

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
