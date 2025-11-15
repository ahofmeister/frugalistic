"use client";
import { parseAsString, useQueryState } from "nuqs";

import { Input } from "@/components/ui/input";

const TransactionSearchInput = () => {
  const [description, setDescription] = useQueryState(
    "description",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  return (
    <Input
      onChange={(event) => {
        void setDescription(event.target.value || null);
      }}
      value={description}
      placeholder="Search transactions"
    />
  );
};

export default TransactionSearchInput;
