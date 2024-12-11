"use client";
import { useEffect, useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Input } from "@/components/ui/input";

const TransactionSearchInput = (props: { value?: string }) => {
  const [value, setValue] = useState<string | undefined>(props.value ?? "");
  const updateQueryParams = useUpdateQueryParam();

  useEffect(() => {
    setValue(props?.value ?? "");
  }, [props.value]);

  return (
    <div className="max-w-sm">
      <Input
        onChange={(event) => {
          const newValue = event.target.value;
          setValue(newValue);
          updateQueryParams({ key: "description", value: newValue ?? "" });
        }}
        value={value}
        placeholder="Search transactions"
      />
    </div>
  );
};

export default TransactionSearchInput;
