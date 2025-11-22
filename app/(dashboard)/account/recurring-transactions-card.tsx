import Link from "next/link";
import React from "react";

import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

const RecurringTransactionsCard = async () => {
  const supabase = await createClient();

  const { count } = await supabase
    .from("transactions_recurring")
    .select("*", { count: "exact", head: true });

  return (
    <Link href="/transactions/recurring">
      <Card className="flex justify-between">
        <div>Recurring Transactions</div>
        <div>{count}</div>
      </Card>
    </Link>
  );
};

export default RecurringTransactionsCard;
