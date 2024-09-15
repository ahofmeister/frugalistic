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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5">
      <DashboardCard amount={income} type="income" label="Income" />
      <DashboardCard
        amount={savings}
        type="savings"
        label="Savings"
        total={income}
      />
      <DashboardCard
        amount={expense}
        type="expense"
        label="Expenses"
        total={income}
      />
      <DashboardCard amount={leftover} label="Leftover" total={income} />
    </div>
  );
};

export default DashboardCards;
