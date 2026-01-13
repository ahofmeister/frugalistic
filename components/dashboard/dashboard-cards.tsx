import React from "react";

import DashboardCard from "@/components/dashboard/dashboard-card";
import { getPeriodDates } from "@/utils/transaction/dates";
import { DashboardParams } from "@/app/(dashboard)/dashboard/page";
import { loadSearchParams } from "@/app/(dashboard)/search-params";
import { dbTransaction } from "@/db";
import { categories, transactions } from "@/db/migrations/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";

const DashboardCards = async ({
  searchParams,
}: {
  searchParams: Promise<DashboardParams>;
}) => {
  let income = 0;
  let expense = 0;
  let savings = 0;
  let fixedCosts = 0;
  let variableCosts = 0;

  const awaitedParams = await loadSearchParams(searchParams);

  const { startDate, endDate } = getPeriodDates(
    awaitedParams.year,
    awaitedParams.month,
    awaitedParams.period,
  );

  const fetchedTransactions = await dbTransaction((tx) => {
    return tx
      .select()
      .from(transactions)
      .leftJoin(categories, eq(transactions.category, categories.id))
      .where(
        and(
          gte(transactions.datetime, startDate),
          lte(transactions.datetime, endDate),
        ),
      )
      .orderBy(desc(transactions.datetime), desc(transactions.createdAt));
  });

  const transactionsWithCategory = fetchedTransactions.map((row) => ({
    ...row.transactions,
    category: row.categories,
  }));

  transactionsWithCategory?.forEach((transaction) => {
    const amount = transaction.amount;
    switch (transaction.type) {
      case "income":
        income += amount;
        break;
      case "expense":
        expense += amount;
        if (transaction.costType === "fixed") {
          fixedCosts += amount;
        } else if (transaction.costType === "variable") {
          variableCosts += amount;
        }
        break;
      case "savings":
        savings += amount;
        break;
    }
  });

  const leftover = income - expense - savings;

  return (
    <div className="flex">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 justify-center w-full">
        <DashboardCard
          amount={income}
          type="income"
          label="Income this period"
        />
        <DashboardCard
          amount={savings}
          type="savings"
          total={income}
          ofLabel="income"
        />
        <DashboardCard
          amount={expense}
          type="expense"
          total={income}
          ofLabel="income"
          breakdown={{
            fixed: fixedCosts,
            variable: variableCosts,
          }}
        />
        <DashboardCard
          amount={leftover}
          total={income}
          type="leftover"
          ofLabel="income left"
        />
      </div>
    </div>
  );
};

export default DashboardCards;
