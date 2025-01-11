"use client";
import React, { useEffect, useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import AmountInput from "@/components/transactions/components/amount-input";

const AmountSearchFilter = (props: {
  paramName: string;
  placeholder: string;
  value?: string;
}) => {
  const [value, setValue] = useState<string | undefined>(
    props.value ? props.value : undefined,
  );

  useEffect(() => {
    setValue(props?.value ?? "");
  }, [props.value]);

  const updateQueryParams = useUpdateQueryParam();

  return (
    <AmountInput
      value={value ?? ""}
      onChange={(value) => {
        setValue(value);
        updateQueryParams({
          key: props.paramName,
          value: value?.toString(),
        });
      }}
    />
  );
};

export default AmountSearchFilter;
