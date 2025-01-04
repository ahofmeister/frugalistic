import { ArrowDown, ArrowUp } from "lucide-react";

import TransactionAmount, {
  getBgColor,
} from "@/components/transactions/components/transaction-amount";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/types";
import { createClient } from "@/utils/supabase/server";

function getCardFooter(percentageChange: number) {
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
}

export async function TotalCard(props: {
  year: number;
  type: TransactionType;
}) {
  const supabase = await createClient();

  const { data: currentYear } = await (async () => {
    return supabase
      .rpc("get_total_by_type_and_year", {
        transaction_year: props.year,
        transaction_type: props.type,
      })
      .select("*")
      .single();
  })();

  const { data: previousYear } = await supabase
    .rpc("get_total_by_type_and_year", {
      transaction_year: props.year - 1,
      transaction_type: props.type,
    })
    .select("*")
    .single();

  const percentageChange =
    previousYear?.total && currentYear?.total
      ? ((currentYear.total - previousYear?.total) / previousYear?.total) * 100
      : 0;

  return (
    // @ts-expect-error CSS property exists
    <Card className={getBgColor(props.type)} style={{ "--tw-bg-opacity": 0.2 }}>
      <CardHeader>
        <CardTitle>
          <TransactionAmount
            className="text-2xl"
            amount={currentYear!.total}
            type={props.type}
          />
        </CardTitle>
        <CardDescription>
          <span className="flex gap-x-2">
            Previous:
            <TransactionAmount amount={previousYear!.total} type={props.type} />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>{getCardFooter(percentageChange)}</CardContent>
      <CardFooter>
        <div className="flex gap-x-1">
          <div>Monthly Average</div>
          <TransactionAmount
            amount={currentYear!.total / getMonthsInYear(props.year)}
            type={props.type}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

function getMonthsInYear(year: number): number {
  return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}
