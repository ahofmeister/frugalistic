import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import TransactionCategoryTable from "@/app/dashboard/insights/transaction-type/transaction-category-table";
import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import { SelectToday } from "@/components/dashboard/select-today";
import { getTotalByCategory } from "@/components/transactions/transactions-api";

export default async function CategoryStatisticPage(props: {
  searchParams: Promise<{ year: number }>;
}) {
  const searchParams = await props.searchParams;

  const transactionsByCategory = await getTotalByCategory(
    searchParams.year ?? new Date().getFullYear(),
  );

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
        <TransactionCategoryTable data={transactionsByCategory} />
      </div>
    </div>
  );
}
