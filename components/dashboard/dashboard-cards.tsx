"use client";
import React from "react";

import DashboardCard from "@/components/dashboard/dashboard-card";
import { TransactionWithCategory } from "@/types";

const DashboardCards = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  let income = 0;
  let expense = 0;
  let savings = 0;

  transactions.forEach((transaction) => {
    const amount = transaction.amount;
    switch (transaction.type) {
      case "income":
        income += amount;
        break;
      case "expense":
        expense += amount;
        break;
      case "savings":
        savings += amount;
        break;
    }
  });

  const leftover = income - expense - savings;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 sm:gap-x-5">
      <DashboardCard
        amount={income}
        type="income"
        headline="Income"
        label="Net income this period"
      />
      <DashboardCard
        amount={savings}
        type="savings"
        headline="Savings"
        total={income}
      />
      <DashboardCard
        amount={expense}
        type="expense"
        headline="Expenses"
        total={income}
      />
      <DashboardCard amount={leftover} headline="Leftover" total={income} />
    </div>
  );
};

export default DashboardCards;
