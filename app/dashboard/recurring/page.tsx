import React, { Suspense } from "react";

import RecurringTransactionTable from "@/app/dashboard/recurring/recurring-transaction-table";
import LoadingSpinner from "@/components/loading/loading";

export default function TransactionsPage() {
  return (
    <>
      <div className="flex gap-10">
        <Suspense fallback={<LoadingSpinner />}>
          <RecurringTransactionTable />
        </Suspense>
      </div>
    </>
  );
}
