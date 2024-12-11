"use client";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const ResetQueryParam = () => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push("/dashboard/search");
      }}
    >
      <ResetIcon />
    </Button>
  );
};
export default ResetQueryParam;
