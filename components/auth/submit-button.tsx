"use client";

import { useFormStatus } from "react-dom";

import LoadingSpinner from "@/components/loading/loading";
import { Button, ButtonProps } from "@/components/ui/button";

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {isPending ? <LoadingSpinner /> : children}
    </Button>
  );
}
