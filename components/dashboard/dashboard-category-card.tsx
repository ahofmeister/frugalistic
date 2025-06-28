"use client";
import { endOfMonth, formatDate, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardCategoryCard({
  category,
  total,
  fill,
  month,
  year,
}: {
  category: string;
  total: number;
  fill: string;
  month: number;
  year: number;
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
      <CardHeader>{category}</CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="text-lg">{formatAmount(total)}</div>
      </CardContent>
    </Card>
  );
}
