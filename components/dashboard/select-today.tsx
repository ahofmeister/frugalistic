"use client";
import React from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";

type SelectTodayMode = "year" | "month" | "both";

export function SelectToday(props: {
  updateMode: SelectTodayMode;
  label?: string;
}) {
  const update = useUpdateQueryParam();

  const handleClick = () => {
    const currentDate = new Date();
    const updates: { key: string; value: string }[] = [];

    if (props.updateMode === "month" || props.updateMode === "both") {
      updates.push({ key: "month", value: currentDate.getMonth().toString() });
    }
    if (props.updateMode === "year" || props.updateMode === "both") {
      updates.push({
        key: "year",
        value: currentDate.getFullYear().toString(),
      });
    }

    update(updates);
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      {props.label ? props.label : "Today"}
    </Button>
  );
}
