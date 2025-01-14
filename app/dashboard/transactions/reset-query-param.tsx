"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const ResetQueryParam = (props: { disabled?: boolean }) => {
  const router = useRouter();
  return (
    <Button
      disabled={props.disabled}
      variant="secondary"
      onClick={() => {
        router.push("/dashboard/search");
      }}
    >
      Reset Filter
    </Button>
  );
};
export default ResetQueryParam;
