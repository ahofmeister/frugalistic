"use client";
import { useRouter } from "next/navigation";
import React from "react";

import { AverageAmount } from "@/app/dashboard/insights/average-amount";
import TransactionAmount, {
  formatAmount,
} from "@/components/transactions/components/transaction-amount";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getYearBoundaries } from "@/utils/transaction/dates";

function InsightCategoryCard({
  category,
  previousTotal,
  months,
  year,
}: {
  category: {
    name: string;
    total: number;
    color: string;
  };
  previousTotal?: number;
  months: number;
  year: number;
}) {
  const router = useRouter();

  const { startDate, endDate } = getYearBoundaries(year);

  return (
    <Card
      className="cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: `${category.color}40`,
        transformOrigin: "center",
      }}
      onClick={() =>
        router.push(
          `/dashboard/search?category=${category.name}&dateFrom=${startDate}&dateTo=${endDate}&type=expense`,
        )
      }
    >
      <CardHeader>
        <CardTitle>
          <div className="text-lg">{category.name}</div>
          <div className="flex justify-between text-xl">
            {formatAmount(category.total)}
            <AverageAmount amount={category.total / months} />
          </div>
        </CardTitle>
      </CardHeader>
      {previousTotal && previousTotal > 0 && (
        <CardFooter className="flex flex-col text-muted-foreground items-start">
          <span className="text-sm">{year - 1}</span>
          <div className="flex justify-between w-full">
            <TransactionAmount amount={previousTotal} />
            <AverageAmount amount={(previousTotal || 0) / 12} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default InsightCategoryCard;
