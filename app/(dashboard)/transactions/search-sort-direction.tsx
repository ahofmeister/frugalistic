"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

export type SortDirection = "asc" | "desc";

const SearchSortDirection = () => {
  const [sortDirection, setSortDirection] = useQueryState(
    "sortDirection",
    parseAsString.withOptions({
      shallow: false,
    }),
  );

  return (
    <Button
      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
    >
      {sortDirection === "asc" ? (
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
