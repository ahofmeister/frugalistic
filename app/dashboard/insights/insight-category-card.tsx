"use client";
import { useRouter } from "next/navigation";
import React from "react";

import { AverageAmount } from "@/app/dashboard/insights/average-amount";
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
import { getYearBoundaries } from "@/utils/transaction/dates";

function CategoryCard({
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
        <AverageAmount amount={category.total / months} />
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;
