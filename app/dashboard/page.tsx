import { endOfMonth, endOfYear, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Suspense } from "react";

import { CategoriesBanner } from "@/app/dashboard/categories/categories-banner";
import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { Period, PeriodSelector } from "@/components/dashboard/period-selector";
import { SelectNow } from "@/components/dashboard/select-now";

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
    <div className="flex flex-col space-y-4 p-0.5">
      <div className="pr-6">
        <CategoriesBanner />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-y-4">
        <div className="flex font-semibold text-2xl items-center gap-x-4">
          <MonthYearStepper
            period={period}
            amount={-1}
            icon={<ChevronLeft />}
            year={year}
            month={month}
          />
          {isYear ? year : format(new Date(year, month, 1), "MMMM yyyy")}
          <MonthYearStepper
            period={period}
            amount={1}
            icon={<ChevronRight />}
            year={year}
            month={month}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex font-semibold text-xl justify-center gap-x-2">
            <SelectNow />
          </div>
          <PeriodSelector value={searchParams.period} year={year} />
        </div>
      </div>

      <Suspense fallback="loading">
        <DashboardCards startDate={startDate} endDate={endDate} />
      </Suspense>
      <Suspense fallback="loading">
        <DashboardCategories startDate={startDate} endDate={endDate} />
      </Suspense>

      <div className="mt-4">
        <Suspense fallback="loading">
          <DashboardTransactions startDate={startDate} endDate={endDate} />
        </Suspense>
      </div>
    </div>
  );
}
