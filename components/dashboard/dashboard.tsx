import { format } from "date-fns";
import Link from "next/link";
import React from "react";

import DashboardCategories from "@/components/dashboard/dashboard-categories";
import DashboardDivisions from "@/components/dashboard/dashboard-divisions";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import DashboardCard from "@/components/dashboard-card";
import MonthYearDashboard from "@/components/month-year-dashboard";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";
import { Button } from "@/ui/button";

export default async function Dashboard({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const transactionTotal = await getTransactionsTotal({ year: year });

  const leftover =
    transactionTotal[month]?.income -
    transactionTotal[month].expense -
    transactionTotal[month].savings;

  return (
    <div className="flex-col flex-wrap">
      <div className="flex gap-5 my-5 justify-between">
        <div className="flex ">
          <div className="font-bold text-3xl">
            {year} - {format(new Date(year, month, 1), "MMMM")}
          </div>
          <MonthYearDashboard />
        </div>

        <Link href="/transactions/new">
          <Button>New Transaction</Button>
        </Link>
      </div>

      <div className="h-72 flex gap-10 mb-10 flex-wrap justify-between">
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

        <div className="flex gap-10 flex-wrap">
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
