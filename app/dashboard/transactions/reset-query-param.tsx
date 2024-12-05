"use client";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const ResetQueryParam = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/dashboard/search");
      }}
    >
      <ResetIcon />
    </button>
  );
};
export default ResetQueryParam;
