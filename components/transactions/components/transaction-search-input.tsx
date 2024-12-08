"use client";
import { useEffect, useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Input } from "@/components/ui/input";

const TransactionSearchInput = (props: { value?: string }) => {
  const [value, setValue] = useState(props.value);
  const updateQueryParams = useUpdateQueryParam();

  useEffect(() => {
    updateQueryParams({ key: "description", value: value ?? "" });
  }, [value]);

  return (
    <div className="max-w-sm">
      <Input
        onChange={(event) => {
          setValue(event.target.value);
        }}
        value={value}
        placeholder="Search transactions"
      />
    </div>
  );
};

export default TransactionSearchInput;
