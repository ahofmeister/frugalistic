import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";

import { CategoriesBanner } from "@/app/dashboard/categories/categories-banner";
import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import { loadSearchParams } from "@/app/dashboard/search-params";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { Period, PeriodSelector } from "@/components/dashboard/period-selector";
import { SelectNow } from "@/components/dashboard/select-now";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { month, year, period } = await loadSearchParams(searchParams);

  return (
    <div className="flex flex-col space-y-4 p-0.5">
      <div className="pr-6">
        <CategoriesBanner />
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-y-4">
        <div className="flex font-semibold text-2xl items-center gap-x-4">
          <MonthYearStepper
            period={period as Period}
            amount={-1}
            icon={<ChevronLeft />}
            incomingYear={year}
            incomingMonth={month}
          />
          {period === "year"
            ? year
            : format(new Date(year, month, 1), "MMMM yyyy")}
          <MonthYearStepper
            period={period as Period}
            amount={1}
            icon={<ChevronRight />}
            incomingYear={year}
            incomingMonth={month}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex font-semibold text-xl justify-center gap-x-2">
          <SelectNow />
        </div>
        <PeriodSelector value={period} year={year} />
      </div>

      <Suspense fallback="loading">
        <DashboardCards month={month} year={year} period={period} />
      </Suspense>
      <Suspense fallback="loading">
        <DashboardCategories month={month} year={year} period={period} />
      </Suspense>

      <div className="mt-4">
        <Suspense fallback="loading">
          <DashboardTransactions month={month} year={year} period={period} />
        </Suspense>
      </div>
    </div>
  );
}
