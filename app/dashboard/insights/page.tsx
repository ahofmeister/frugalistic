import { format } from "date-fns";
import Link from "next/link";
import React from "react";

import SelectYear from "@/app/dashboard/insights/select-year";
import TransactionCategoryDistribution from "@/app/dashboard/insights/transaction-category-distribution";
import { TransactionsChart } from "@/app/dashboard/insights/transactions-chart";
import { navConfig } from "@/components/navigation/nav-config";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

const InsightsPage = async ({
  searchParams,
}: {
  searchParams: { year: number };
}) => {
  const insightsNavItem = navConfig.dashboardNavigation.find(
    (item) => item.title === "Insights",
  );

  const supabase = createClient();

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
      <div className="flex mb-4">
        <SelectYear
          value={searchParams.year}
          min={yearRange?.minyear}
          max={yearRange?.maxyear}
        />
      </div>
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
