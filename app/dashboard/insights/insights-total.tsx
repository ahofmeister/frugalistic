import React from "react";

import InsightsTotalCard from "@/app/dashboard/insights/insights-total-card";
import { TransactionType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function InsightsTotal(props: {
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

  return (
    <InsightsTotalCard
      year={props.year}
      type={props.type}
      currentYearTotal={currentYear!.total}
      previousYearTotal={previousYear!.total}
    />
  );
}
