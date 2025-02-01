import React from "react";

import InsightCategoryCard from "@/app/dashboard/insights/insight-category-card";
import { createClient } from "@/utils/supabase/server";
import { getYearBoundaries } from "@/utils/transaction/dates";

export async function InsightCategories(props: { year: number }) {
  const supabase = await createClient();

  const currentYear = getYearBoundaries(props.year);
  const previousYear = getYearBoundaries(props.year - 1);

  const { data } = await supabase.rpc("get_category_totals", {
    from_date: currentYear.startDate,
    to_date: currentYear.endDate,
  });

  const { data: previousYearData } = await supabase.rpc("get_category_totals", {
    from_date: previousYear.startDate,
    to_date: previousYear.endDate,
  });
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
      {data?.map((category) => {
        const previousTotal = previousYearData?.find(
          (prevCategory) => prevCategory.name === category.name,
        )?.total;
        return (
          <InsightCategoryCard
            year={props.year}
            key={category.name}
            category={category}
            previousTotal={previousTotal}
            months={getMonthsInYear(props.year)}
          />
        );
      })}
    </div>
  );
}

function getMonthsInYear(year: number): number {
  return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}
