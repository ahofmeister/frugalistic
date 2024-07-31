"use client";
import { ResetIcon } from "@radix-ui/react-icons";

import useQueryParams from "@/app/useQueryParams";

const ResetQueryParam = () => {
  const { reset } = useQueryParams("");
  return (
    <button onClick={() => reset()}>
      <ResetIcon />
    </button>
  );
};
export default ResetQueryParam;
