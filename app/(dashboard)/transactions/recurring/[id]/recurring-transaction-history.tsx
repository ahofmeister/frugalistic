import TransactionList from "@/components/transactions/components/transaction-list";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import {
  categories,
  transactionSchema,
  transactionsRecurring,
} from "@/db/migrations/schema";
import { dbTransaction } from "@/db";
import { desc, eq } from "drizzle-orm";

export async function RecurringTransactionHistory(props: {
  recurringTransactionId: Promise<string>;
}) {
  const id = await props.recurringTransactionId;

  const transactions = await dbTransaction((tx) => {
    return tx
      .select()
      .from(transactionSchema)
      .leftJoin(categories, eq(transactionSchema.category, categories.id))
      .leftJoin(
        transactionsRecurring,
        eq(transactionSchema.recurringTransaction, transactionsRecurring.id),
      )
      .where(eq(transactionSchema.recurringTransaction, id))
      .orderBy(desc(transactionSchema.datetime))
      .then((rows) =>
        rows.map((row) => ({
          ...row.transactions,
          category: row.categories,
          recurring_transaction: row.transactions_recurring,
        })),
      );
  });

  const settings = await getSettings();
  return (
    <TransactionList
      transactions={transactions}
      dateFormat={settings.date_format}
    />
  );
}
