import { format } from "date-fns";
import Link from "next/link";
import React, { Suspense } from "react";

import { InsightCategories } from "@/app/dashboard/insights/insight-categories";
import { TotalCard } from "@/app/dashboard/insights/total-card";
import TransactionCategoryDistribution from "@/app/dashboard/insights/transaction-category-distribution";
import SelectYear from "@/app/dashboard/insights/transaction-type-select";
import { TransactionsChart } from "@/app/dashboard/insights/transactions-chart";
import { navConfig } from "@/components/navigation/nav-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionTypes } from "@/lib/transaction-types";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

const InsightsPage = async (props: {
  searchParams: Promise<{ year: number }>;
}) => {
  const searchParams = await props.searchParams;
  const insightsNavItem = navConfig.dashboardNavigation.find(
    (item) => item.title === "Insights",
  );

  const supabase = await createClient();

  const possibleYear = Number(searchParams.year);

  const year = isNaN(possibleYear) ? new Date().getFullYear() : possibleYear;

  type YearRange = {
    minyear: number;
    maxyear: number;
  };

  const { data: yearRange } = await supabase
    .rpc("get_min_and_max_year")
    .select("*")
    .returns<YearRange[]>()
    .single();

  const { data: transactions = [] } = await supabase
    .from("transactions")
    .select("*, category(*)")
    .gte("datetime", format(new Date(year, 0, 1), "yyyy-MM-dd"))
    .lte("datetime", format(new Date(year, 11, 31), "yyyy-MM-dd"))
    .returns<TransactionWithCategory[]>();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex gap-x-4 justify-between items-center">
        <div className="text-2xl">Insights of {year}</div>
        <SelectYear
          value={searchParams.year}
          min={yearRange?.minyear}
          max={yearRange?.maxyear}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-min">
        {transactionTypes.map((type) => (
          <div key={type}>
            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-7 w-10" />
                    </CardTitle>
                    <CardDescription>
                      <div className="flex gap-x-2 items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-36" />
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-x-1 items-center">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardFooter>
                </Card>
              }
            >
              <TotalCard year={year} type={type} />
            </Suspense>
          </div>
        ))}
      </div>

      <Suspense fallback="Loading categories...">
        <InsightCategories year={year} />
      </Suspense>

      <TransactionsChart transactions={transactions ?? []} />
      <TransactionCategoryDistribution
        transactions={
          transactions?.filter(
            (transaction) => transaction.type === "expense",
          ) ?? []
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {insightsNavItem?.items?.map((item) => (
          <Link key={item.href} href={item.href} className="hover:no-underline">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InsightsPage;
