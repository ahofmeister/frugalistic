"use client";
import { endOfMonth, formatDate, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardCategoryCard({
  category,
  amount,
  fill,
  month,
  year,
  total,
}: {
  category: string;
  amount: number;
  fill: string;
  month: number;
  year: number;
  total: number;
}) {
  const router = useRouter();
  const dateFrom = formatDate(
    startOfMonth(new Date(year, month, 1)),
    "yyyy-MM-dd",
  );
  const dateTo = formatDate(endOfMonth(new Date(year, month, 1)), "yyyy-MM-dd");
  return (
    <Card
      className="cursor-pointer"
      style={{ color: fill }}
      onClick={() =>
        router.push(
          `/dashboard/search?category=${category}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        )
      }
    >
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex gap-x-1 items-center">
          <div className="text-lg">{formatAmount(amount)}</div>
        </div>
        <span className="text-sm text-gray-400">
          <>{`${((amount / total) * 100).toFixed(2)}% of total`}</>
        </span>
      </CardContent>
    </Card>
  );
}
