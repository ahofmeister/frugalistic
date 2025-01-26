import React from "react";

import CategoryCard from "@/app/dashboard/insights/insight-category-card";
import { createClient } from "@/utils/supabase/server";
import { getYearBoundaries } from "@/utils/transaction/dates";

export async function InsightCategories(props: { year: number }) {
  const supabase = await createClient();

  const { startDate, endDate } = getYearBoundaries(props.year);

  const { data } = await supabase.rpc("get_category_totals", {
    from_date: startDate,
    to_date: endDate,
  });

  const { data: prev } = await supabase.rpc("get_category_totals", {
    from_date: startDate,
    to_date: endDate,
  });
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
      {data?.map((category) => {
        const previousTotal = prev?.find(
          (prevCategory) => prevCategory.name === category.name,
        )?.total;
        return (
          <CategoryCard
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
