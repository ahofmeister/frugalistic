import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";

import { MonthYearStepper } from "@/app/dashboard/month-year-stepper";
import { loadSearchParams } from "@/app/dashboard/search-params";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { month, year, period } = await loadSearchParams(searchParams);

  const stuff = await searchParams;

  // const year = Number(searchParams?.year ?? new Date().getFullYear());
  // const month = Number(searchParams?.month ?? new Date().getMonth());
  // const isYear = period === "year";
  //
  // const startDate = format(
  //   isYear ? new Date(year, 0, 1) : new Date(year, month, 1),
  //   "yyyy-MM-dd",
  // );
  //
  // const endDate = format(
  //   isYear
  //     ? endOfYear(new Date(year, 1, 1))
  //     : endOfMonth(new Date(year, month, 1)),
  //   "yyyy-MM-dd",
  // );

  console.log(JSON.stringify(await searchParams));
  return (
    <div className="flex flex-col space-y-4 p-0.5">
      {/*<div className="pr-6">*/}
      {/*  {year} - {month} - {period}*/}
      {/*  {JSON.stringify(stuff)}*/}
      {/*  <CategoriesBanner />*/}
      {/*</div>*/}
      {JSON.stringify(stuff, null, 2)}
      <div className="flex flex-col sm:flex-row justify-between gap-y-4">
        <div className="flex font-semibold text-2xl items-center gap-x-4">
          <MonthYearStepper
            period={period}
            amount={-1}
            icon={<ChevronLeft />}
            incomingYear={year}
            incomingMonth={month}
          />
          {/*{isYear ? year : format(new Date(year, month, 1), "MMMM yyyy")}*/}
          <MonthYearStepper
            period={period}
            amount={1}
            icon={<ChevronRight />}
            incomingYear={year}
            incomingMonth={month}
          />
        </div>
      </div>

      {/*  <div className="flex gap-4">*/}
      {/*    <div className="flex font-semibold text-xl justify-center gap-x-2">*/}
      {/*      <SelectNow />*/}
      {/*    </div>*/}
      {/*    <PeriodSelector value={period} year={year} />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<Suspense fallback="loading">*/}
      {/*  <DashboardCards startDate={startDate} endDate={endDate} />*/}
      {/*</Suspense>*/}
      {/*<Suspense fallback="loading">*/}
      {/*  <DashboardCategories startDate={startDate} endDate={endDate} />*/}
      {/*</Suspense>*/}

      <div className="mt-4">
        <Suspense fallback="loading">
          <DashboardTransactions month={month} year={year} />
        </Suspense>
      </div>
    </div>
  );
}
