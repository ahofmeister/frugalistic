import { endOfMonth, endOfYear, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import { DashboardSelectToday } from "@/components/dashboard/dashboard-select-today";
import { Period, PeriodSelector } from "@/components/dashboard/period-selector";
import TransactionList from "@/components/transactions/components/transaction-list";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage(props: {
  searchParams: Promise<{ year: number; month: number; period: Period }>;
}) {
  const searchParams = await props.searchParams;
  const year = Number(searchParams?.year ?? new Date().getFullYear());
  const month = Number(searchParams?.month ?? new Date().getMonth());
  const isYear = searchParams.period === "year";

  const supabase = await createClient();
  const startDate = isYear ? new Date(year, 0, 1) : new Date(year, month, 1);
  const endDate = isYear
    ? endOfYear(new Date(year, 1, 1))
    : endOfMonth(new Date(year, month, 30));

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", format(startDate, "yyyy-MM-dd"))
    .lte("datetime", format(endDate, "yyyy-MM-dd"))
    .order("datetime", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<TransactionWithCategory[]>();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen">
        <div className="container mx-auto p-0.5">
          <div className="flex font-semibold text-2xl justify-center">
            {isYear ? year : format(new Date(year, month, 1), "MMMM yyyy")}
          </div>
          <div className="flex sm:flex-row justify-between items-start sm:items-center mt-2 mb-6 space-y-4 sm:space-y-0">
            <div className="flex space-x-10">
              <div className="flex space-x-2">
                <MonthYearStepper
                  period={searchParams.period}
                  amount={-1}
                  icon={<ChevronLeft />}
                  year={year}
                  month={month}
                />
                <DashboardSelectToday />
                <MonthYearStepper
                  period={searchParams.period}
                  amount={1}
                  icon={<ChevronRight />}
                  year={year}
                  month={month}
                />
              </div>
            </div>

            <PeriodSelector value={searchParams.period} year={year} />
          </div>
          <div className="mb-6">
            <DashboardCards transactions={allTransactions ?? []} />
          </div>
          <div className="flex">
            <DashboardCategories transactions={allTransactions ?? []} />
          </div>
        </div>
        <div className="mt-4">
          <TransactionList transactions={allTransactions ?? []} />
        </div>
      </div>
    </div>
  );
}
