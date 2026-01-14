import TransactionList from "@/components/transactions/components/transaction-list";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import {
  categories,
  transactionSchema,
  transactionsRecurring,
  TransactionWithRecurringCategory,
} from "@/db/migrations/schema";
import { dbTransaction } from "@/db";
import { and, desc, eq, ne } from "drizzle-orm";

export async function RelatedTransactions(props: { id: Promise<string> }) {
  const id = await props.id;

  const [transaction] = await dbTransaction((tx) => {
    return tx
      .select()
      .from(transactionSchema)
      .where(eq(transactionSchema.id, id))
      .limit(1);
  });

  if (!transaction) {
    return;
  }

  const transactions: TransactionWithRecurringCategory[] = await dbTransaction(
    async (tx) => {
      const rows = await tx
        .select()
        .from(transactionSchema)
        .leftJoin(categories, eq(transactionSchema.category, categories.id))
        .leftJoin(
          transactionsRecurring,
          eq(transactionSchema.recurringTransaction, transactionsRecurring.id),
        )
        .where(
          and(
            eq(transactionSchema.description, transaction.description),
            ne(transactionSchema.id, transaction.id),
          ),
        )
        .orderBy(desc(transactionSchema.datetime));
      return rows.map((row) => ({
        ...row.transactions,
        category: row.categories,
        recurring_transaction: row.transactions_recurring,
      }));
    },
  );

  if (!transactions || transactions.length === 0) {
    return;
  }

  const settings = await getSettings();

  return (
    <TransactionList
      transactions={transactions}
      dateFormat={settings.date_format}
    />
  );
}
