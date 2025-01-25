import React from "react";

import DashboardCard from "@/components/dashboard/dashboard-card";
import { Period } from "@/components/dashboard/period-selector";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { getPeriodDates } from "@/utils/transaction/dates";

const DashboardCards = async (props: {
  month: number;
  year: number;
  period: Period;
}) => {
  let income = 0;
  let expense = 0;
  let savings = 0;

  const { startDate, endDate } = getPeriodDates(
    props.year,
    props.month,
    props.period,
  );

  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", startDate)
    .lte("datetime", endDate)
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithCategory[]>();

  transactions?.forEach((transaction) => {
    const amount = transaction.amount;
    switch (transaction.type) {
      case "income":
        income += amount;
        break;
      case "expense":
        expense += amount;
        break;
      case "savings":
        savings += amount;
        break;
    }
  });

  const leftover = income - expense - savings;

  return (
    <div className="flex">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 justify-center">
        <DashboardCard
          amount={income}
          type="income"
          label="Income this period"
        />
        <DashboardCard
          amount={savings}
          type="savings"
          total={income}
          ofLabel="income"
        />
        <DashboardCard
          amount={expense}
          type="expense"
          total={income}
          ofLabel="income"
        />
        <DashboardCard
          amount={leftover}
          total={income}
          type="leftover"
          ofLabel="income left"
        />
      </div>
    </div>
  );
};

export default DashboardCards;
