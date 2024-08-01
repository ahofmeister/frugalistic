"use client";
import { useEffect, useState } from "react";

import useQueryParams from "@/app/useQueryParams";
import { Input } from "@/components/ui/input";

const TransactionSearch = () => {
  const { queryParam, setQueryParam } = useQueryParams("description");
  const [, setDescription] = useState(queryParam);

  useEffect(() => {
    setDescription(queryParam);
  }, [queryParam]);

  return (
    <div className="max-w-sm ">
      <Input
        onChange={(event) => {
          setQueryParam(event.target.value);
          setDescription(event.target.value);
        }}
        placeholder="Search transactions"
      />
    </div>
  );
};

export default TransactionSearch;
