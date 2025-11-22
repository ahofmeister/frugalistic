import React from "react";

import InsightCategoryCard from "@/app/(dashboard)/insights/insight-category-card";
import { createClient } from "@/utils/supabase/server";
import { getYearBoundaries } from "@/utils/transaction/dates";
import { SearchParams } from "nuqs/server";
import { loadYearSearchParam } from "@/lib/utils";

export async function InsightCategories({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const { year } = await loadYearSearchParam(searchParams);

  const currentYear = getYearBoundaries(year);
  const previousYear = getYearBoundaries(year - 1);

  const { data } = await supabase.rpc("get_category_totals", {
    from_date: currentYear.startDate,
    to_date: currentYear.endDate,
  });

  const { data: previousYearData } = await supabase.rpc("get_category_totals", {
    from_date: previousYear.startDate,
    to_date: previousYear.endDate,
  });
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {data?.map((category) => {
        const previousTotal = previousYearData?.find(
          (prevCategory) => prevCategory.name === category.name,
        )?.total;
        return (
          <InsightCategoryCard
            year={year}
            key={category.name}
            category={category}
            previousTotal={previousTotal}
            months={getMonthsInYear(year)}
          />
        );
      })}
    </div>
  );
}

function getMonthsInYear(year: number): number {
  return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}
