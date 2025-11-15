import React, { Suspense } from "react";

import { MemberSince } from "@/app/dashboard/statistics/member-since";
import { NumberCategories } from "@/app/dashboard/statistics/number-categories";
import { NumberRecurringTransactions } from "@/app/dashboard/statistics/number-recurring-transactions";
import { NumberTransactions } from "@/app/dashboard/statistics/number-transactions";
import { TotalTransactionAmount } from "@/app/dashboard/statistics/total-transaction-amount";

export default function StatisticPage() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <Suspense>
        <MemberSince />
      </Suspense>
      <Suspense>
        <TotalTransactionAmount type="income" />
      </Suspense>
      <Suspense>
        <TotalTransactionAmount type="savings" />
      </Suspense>
      <Suspense>
        <TotalTransactionAmount type="expense" />
      </Suspense>
      <Suspense>
        <NumberTransactions />
      </Suspense>
      <Suspense>
        <NumberRecurringTransactions />
      </Suspense>
      <Suspense>
        <NumberCategories />
      </Suspense>
    </div>
  );
}
