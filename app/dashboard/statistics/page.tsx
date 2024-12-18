import React from "react";

import { MemberSince } from "@/app/dashboard/statistics/member-since";
import { NumberTransactions } from "@/app/dashboard/statistics/number-transactions";

export default function StatisticPage() {
  return (
    <div className="flex gap-2">
      <MemberSince />
      <NumberTransactions />
    </div>
  );
}
