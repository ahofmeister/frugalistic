"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useUpdateQueryParams from "@/app/useUpdateQueryParams";
import { useRouter } from "next/navigation";
import { router } from "next/client";

const TransactionSearchInput = (props: { value?: string }) => {
  const [value, setValue] = useState(props.value);
  const updateQueryParams = useUpdateQueryParams();

  useEffect(() => {
    updateQueryParams("description", value ?? "");
  }, [value, updateQueryParams]);

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
