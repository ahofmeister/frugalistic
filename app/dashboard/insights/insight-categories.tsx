import React from "react";

import TransactionAmount, {
  formatAmount,
} from "@/components/transactions/components/transaction-amount";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export async function InsightCategories(props: { year: number }) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_category_totals", {
    from_date: props.year + "-01-01",
    to_date: props.year + "-12-31",
  });

  const { data: prev } = await supabase.rpc("get_category_totals", {
    from_date: props.year - 1 + "-01-01",
    to_date: props.year - 1 + "-12-31",
  });
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
      {data?.map((category) => {
        const previousTotal = prev?.find(
          (prevCategory) => prevCategory.name === category.name,
        )?.total;
        return (
          <Card
            key={category.name}
            style={{ backgroundColor: category.color + "40" }}
          >
            <CardHeader>
              <CardTitle>
                <div className="text-xl">{category.name}</div>
                <div className="text-lg">{formatAmount(category.total)}</div>
              </CardTitle>
              {previousTotal && previousTotal > 0 && (
                <CardDescription>
                  <span className="flex gap-x-2">
                    Previous:
                    <TransactionAmount amount={previousTotal} />
                  </span>
                </CardDescription>
              )}
            </CardHeader>
            <CardFooter>
              <div className="flex gap-x-1">
                <div>Monthly Average</div>
                <TransactionAmount
                  amount={category.total / getMonthsInYear(props.year)}
                />
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function getMonthsInYear(year: number): number {
  return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}
