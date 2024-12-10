import { endOfMonth, endOfYear, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Suspense } from "react";

import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import { DashboardSelectToday } from "@/components/dashboard/dashboard-select-today";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { Period, PeriodSelector } from "@/components/dashboard/period-selector";

export default async function DashboardPage(props: {
  searchParams: Promise<{ year: number; month: number; period: Period }>;
}) {
  const searchParams = await props.searchParams;
  const period = searchParams.period ?? "month";
  const year = Number(searchParams?.year ?? new Date().getFullYear());
  const month = Number(searchParams?.month ?? new Date().getMonth());
  const isYear = searchParams.period === "year";

  const startDate = format(
    isYear ? new Date(year, 0, 1) : new Date(year, month, 1),
    "yyyy-MM-dd",
  );

  const endDate = format(
    isYear
      ? endOfYear(new Date(year, 1, 1))
      : endOfMonth(new Date(year, month, 1)),
    "yyyy-MM-dd",
  );

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
                  period={period}
                  amount={-1}
                  icon={<ChevronLeft />}
                  year={year}
                  month={month}
                />
                <DashboardSelectToday />
                <MonthYearStepper
                  period={period}
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
            <Suspense fallback="loading">
              <DashboardCards startDate={startDate} endDate={endDate} />
            </Suspense>
          </div>
          <div className="flex">
            <Suspense fallback="loading">
              <DashboardCategories startDate={startDate} endDate={endDate} />
            </Suspense>
          </div>
        </div>
        <div className="mt-4">
          <Suspense fallback="loading">
            <DashboardTransactions startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
