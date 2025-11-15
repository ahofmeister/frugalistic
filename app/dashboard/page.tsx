import React, { Suspense } from "react";
import { MonthYearStepper } from "./month-year-stepper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Period, PeriodSelector } from "@/components/dashboard/period-selector";
import { DashboardDateLabel } from "@/app/dashboard/dashboardDateLabel";
import { SelectNow } from "@/components/dashboard/select-now";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { CategoriesBanner } from "@/app/dashboard/categories/categories-banner";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";

export type DashboardParams = {
  month: string;
  year: string;
  period: Period;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardParams>;
}) {
  return (
    <div className="flex flex-col space-y-4 p-0.5">
      <div className="pr-6">
        <Suspense>
          <CategoriesBanner />
        </Suspense>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-y-4">
        <div className="flex font-semibold text-2xl items-center gap-x-4">
          <Suspense>
            <MonthYearStepper amount={-1} icon={<ChevronLeft />} />
            <DashboardDateLabel />
            <MonthYearStepper amount={1} icon={<ChevronRight />} />
          </Suspense>
        </div>
      </div>

      <Suspense>
        <div className="flex gap-4">
          <div className="flex font-semibold text-xl justify-center gap-x-2">
            <SelectNow />
          </div>
          <PeriodSelector />
        </div>
      </Suspense>

      <Suspense>
        <DashboardCards searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <DashboardCategories searchParams={searchParams} />
      </Suspense>

      <div className="mt-4">
        <Suspense>
          <DashboardTransactions searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
