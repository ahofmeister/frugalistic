import React, { Suspense } from "react";

import RecurringTransactions from "@/app/(dashboard)/transactions/recurring/recurring-transactions";
import LoadingSpinner from "@/components/loading/loading";

export default function TransactionsPage() {
  return (
    <div className="flex gap-10">
      <Suspense fallback={<LoadingSpinner />}>
        <RecurringTransactions />
      </Suspense>
    </div>
  );
}
