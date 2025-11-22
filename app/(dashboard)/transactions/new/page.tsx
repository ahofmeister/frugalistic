import React, { Suspense } from "react";
import { TransactionFormData } from "@/app/(dashboard)/transactions/new/transactionFormData";

export default async function NewTransactionPage() {
  return (
    <Suspense>
      <TransactionFormData />
    </Suspense>
  );
}
