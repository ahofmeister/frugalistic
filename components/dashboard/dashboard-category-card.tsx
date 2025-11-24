import Link from "next/link";
import React from "react";

import { Period } from "@/components/dashboard/period-selector";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDateRange } from "@/lib/utils";
import { Icon } from "@/components/ui/icon-picker";
import { IconName } from "lucide-react/dynamic";

export function DashboardCategoryCard({
  category,
  amount,
  fill,
  month,
  year,
  total,
  period,
  icon,
}: {
  category: string;
  amount: number;
  fill: string;
  month: number;
  year: number;
  total: number;
  period: Period;
  icon: IconName | null;
}) {
  const { dateFrom, dateTo } = getDateRange(period, year, month);

  return (
    <Link
      href={`/transactions?category=${category}&dateFrom=${dateFrom}&dateTo=${dateTo}&type=expense`}
    >
      <Card style={{ color: fill }}>
        <CardHeader>
          <CardTitle className={"flex gap-x-2"}>
            {icon && <Icon size={14} name={icon} />}
            {category}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <div className="flex gap-x-1 items-center">
            <div className="text-lg">{formatAmount(amount)}</div>
          </div>
          <span className="text-sm text-gray-400">
            {`${((amount / total) * 100).toFixed(2)}% of total`}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
