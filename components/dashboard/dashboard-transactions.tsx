import React from "react";
import TransactionList from "@/components/transactions/components/transaction-list";
import { getPeriodDates } from "@/utils/transaction/dates";
import { loadSearchParams } from "@/app/(dashboard)/search-params";
import { DashboardParams } from "@/app/(dashboard)/dashboard/page";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { dbTransaction } from "@/db";
import {
  categories,
  transactionSchema,
  transactionsRecurring,
  TransactionWithRecurringCategory,
} from "@/db/migrations/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export default async function DashboardTransactions({
  searchParams,
}: {
  searchParams: Promise<DashboardParams>;
}) {
  const awaitedParams = await loadSearchParams(searchParams);

  const { startDate, endDate } = getPeriodDates(
    awaitedParams.year,
    awaitedParams.month,
    awaitedParams.period,
  );

  const transactionsWithRecurring: TransactionWithRecurringCategory[] = (
    await dbTransaction((tx) => {
      return tx
        .select()
        .from(transactionSchema)
        .leftJoin(categories, eq(transactionSchema.category, categories.id))
        .leftJoin(
          transactionsRecurring,
          eq(transactionSchema.recurringTransaction, transactionsRecurring.id),
        )
        .where(
          and(
            gte(transactionSchema.datetime, startDate),
            lte(transactionSchema.datetime, endDate),
          ),
        )
        .orderBy(
          desc(transactionSchema.datetime),
          desc(transactionSchema.createdAt),
        );
    })
  ).map((row) => ({
    ...row.transactions,
    category: row.categories,
    recurring_transaction: row.transactions_recurring,
  }));

  const settings = await getSettings();

  return (
    <TransactionList
      transactions={transactionsWithRecurring ?? []}
      dateFormat={settings.date_format}
    />
  );
}
