import React from "react";

import { MemberSince } from "@/app/dashboard/statistics/member-since";
import { NumberRecurringTransactions } from "@/app/dashboard/statistics/number-recurring-transactions";
import { NumberTransactions } from "@/app/dashboard/statistics/number-transactions";

export default function StatisticPage() {
  return (
    <div className="flex gap-2">
      <MemberSince />
      <NumberTransactions />
      <NumberRecurringTransactions />
    </div>
  );
}
