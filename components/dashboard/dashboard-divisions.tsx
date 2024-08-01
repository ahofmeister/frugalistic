"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import React from "react";

import DashboardDivisionsChart, {
  DivisionTotal,
} from "@/components/dashboard/dashboard-divisions-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const DashboardDivisions = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const { data } = useQuery(
    createClient()
      .rpc("division_total4", { p_year: year })
      .select()
      .returns<DivisionTotal[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return (
    <Card className="p-4 min-w-[400px]">
      <CardHeader>Categories</CardHeader>
      <CardContent>
        <DashboardDivisionsChart
          divisions={
            data?.filter((division) => division.month === month + 1) ?? []
          }
        />
      </CardContent>
    </Card>
  );
};

export default DashboardDivisions;
