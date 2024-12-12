import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import TransactionTypeTable from "@/app/dashboard/insights/expenses-category/transaction-type-table";
import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import { SelectToday } from "@/components/dashboard/select-today";
import { getTransactionsTotal } from "@/components/transactions/transactions-api";

export default async function TypeStatistic(props: {
  searchParams: Promise<{ year: number }>;
}) {
  const searchParams = await props.searchParams;

  const transactionTotals = await getTransactionsTotal(searchParams.year);

  const year = Number(searchParams?.year ?? new Date().getFullYear());

  return (
    <div>
      <div className="flex gap-x-2">
        <MonthYearStepper
          year={Number(year)}
          month={0}
          amount={-1}
          period="year"
          icon={<ChevronLeft />}
        />

        <SelectToday updateMode="year" label={year.toString()} />

        <MonthYearStepper
          year={year}
          month={0}
          amount={1}
          period="year"
          icon={<ChevronRight />}
        />
      </div>
      <div className="mt-4">
        <TransactionTypeTable
          transactionTotals={transactionTotals}
          year={year}
        />
      </div>
    </div>
  );
}
