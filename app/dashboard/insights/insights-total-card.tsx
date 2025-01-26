"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { AverageAmount } from "@/app/dashboard/insights/average-amount";
import TransactionAmount, {
  getBgColor,
  getTextColor,
} from "@/components/transactions/components/transaction-amount";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize, cn } from "@/lib/utils";
import { TransactionType } from "@/types";
import { getYearBoundaries } from "@/utils/transaction/dates";

function InsightsTotalCard(props: {
  year: number;
  type: TransactionType;
  currentYearTotal: number;
  previousYearTotal: number;
}) {
  const type = props.type;
  const currentYearTotal = props.currentYearTotal;
  const previousYearTotal = props.previousYearTotal;
  const year = props.year;
  const router = useRouter();

  function getMonthsInYear(year: number): number {
    return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
  }

  const percentageChange =
    previousYearTotal && currentYearTotal
      ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
      : 0;

  const Footer = () => {
    const formattedPercentage = Math.abs(Math.round(percentageChange))
      .toFixed(2)
      .replace(/\.?0+$/, "");

    const isNegative = percentageChange < 0;
    const arrow = isNegative ? <ArrowDown size={20} /> : <ArrowUp size={20} />;

    return (
      <div className="flex gap-x-2 items-center">
        {arrow}
        {formattedPercentage}% from last year
      </div>
    );
  };

  const { startDate, endDate } = getYearBoundaries(year);

  return (
    <Card
      className={cn(
        "cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg",
        getBgColor(type),
      )}
      // @ts-expect-error CSS property exists
      style={{ "--tw-bg-opacity": 0.2 }}
      onClick={() =>
        router.push(
          `/dashboard/search?dateFrom=${startDate}&dateTo=${endDate}&type=${type}`,
        )
      }
    >
      <CardHeader>
        <CardTitle className={getTextColor(type)}>
          {capitalize(type as string)}
        </CardTitle>
        <TransactionAmount
          className="text-2xl"
          amount={currentYearTotal}
          type={type}
        />
        {previousYearTotal && previousYearTotal > 0 && (
          <CardDescription>
            <span className="flex gap-x-2">
              Previous:
              <TransactionAmount amount={previousYearTotal} type={type} />
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Footer />
      </CardContent>
      <CardFooter>
        <AverageAmount
          amount={currentYearTotal / getMonthsInYear(year)}
          type={type}
        />
      </CardFooter>
    </Card>
  );
}

export default InsightsTotalCard;
