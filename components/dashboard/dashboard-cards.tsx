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
  let leisureExpense = 0;
  let essentialsExpense = 0;

  transactions.forEach((transaction) => {
    const amount = transaction.amount;
    const division = transaction.category?.division; // Handle category being null
    switch (transaction.type) {
      case "income":
        income += amount;
        break;
      case "expense":
        expense += amount;
        if (division === "leisure") {
          leisureExpense += amount;
        } else if (division === "essentials") {
          essentialsExpense += amount;
        }
        break;
      case "savings":
        savings += amount;
        break;
    }
  });

  const leftover = income - expense - savings;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
      <DashboardCard
        amount={income}
        type="income"
        headline="Income"
        label="Income this period"
      />
      <DashboardCard
        amount={savings}
        type="savings"
        headline="Savings"
        total={income}
        ofLabel="income"
      />
      <DashboardCard
        amount={expense}
        type="expense"
        headline="Expenses"
        total={income}
        ofLabel="income"
      />
      <DashboardCard
        amount={leisureExpense}
        type="leisure"
        headline="Leisure"
        total={expense}
        ofLabel="expense"
      />
      <DashboardCard
        amount={essentialsExpense}
        type="essentials"
        headline="Essentials"
        total={expense}
        ofLabel="expense"
      />
      <DashboardCard
        amount={leftover}
        headline="Leftover"
        total={income}
        ofLabel="income"
      />
    </div>
  );
};

export default DashboardCards;
