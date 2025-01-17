"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";

export type SortDirection = "asc" | "desc";

const SearchSortDirection = (props: { sortDirection: SortDirection }) => {
  const updateQueryParam = useUpdateQueryParam();

  return (
    <Button
      onClick={() =>
        updateQueryParam({
          key: "sortDirection",
          value: props.sortDirection === "asc" ? "desc" : "asc",
        })
      }
    >
      {props.sortDirection === "asc" ? (
        <>
          Ascending <ArrowUp className="ml-2" size={16} />
        </>
      ) : (
        <>
          Descending <ArrowDown className="ml-2" size={16} />
        </>
      )}
    </Button>
  );
};

export default SearchSortDirection;
