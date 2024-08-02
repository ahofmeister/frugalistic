import { format } from "date-fns";
import Link from "next/link";
import React from "react";

import DashboardCategories from "@/components/dashboard/dashboard-categories";
import DashboardDivisions from "@/components/dashboard/dashboard-divisions";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import DashboardCard from "@/components/dashboard-card";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const transactionTotal = await getTransactionsTotal({ year: year });

  const leftover =
    transactionTotal[month]?.income -
    transactionTotal[month].expense -
    transactionTotal[month].savings;

  return (
    <div className="flex-col">
      <div className="flex gap-5 my-5 justify-between">
        <div className="font-bold text-3xl">{format(date, " yyyy MMMM")}</div>
        <Link href="/transactions/new">
          <Button>New Transaction</Button>
        </Link>
      </div>

      <div className="h-72 flex gap-5 mb-10 justify-between">
        <div className="grid grid-cols-2 max-w-fit  gap-10">
          <DashboardCard
            amount={leftover}
            label="Leftover"
            total={transactionTotal[month].income}
          />
          <DashboardCard
            amount={transactionTotal[month].income}
            type="income"
            label="Income"
          />
          <DashboardCard
            amount={transactionTotal[month].savings}
            type="savings"
            label="Savings"
            total={transactionTotal[month].income}
          />
          <DashboardCard
            amount={transactionTotal[month].expense}
            type="expense"
            label="Expenses"
            total={transactionTotal[month].income}
          />
        </div>

        <div className="flex gap-5 flex-wrap">
          <DashboardDivisions month={month} year={year} />

          <DashboardCategories month={month} year={year} />
        </div>
      </div>

      <div className="mt-6">
        <DashboardTransactions />
      </div>
    </div>
  );
}
