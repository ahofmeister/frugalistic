import TransactionList from "@/components/transactions/components/transaction-list";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import {
  transactionSchema,
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
      return tx.query.transactionSchema.findMany({
        where: and(
          eq(transactionSchema.description, transaction.description),
          ne(transactionSchema.id, transaction.id),
        ),
        with: {
          category: true,
          recurringTransaction: true,
        },
        orderBy: [desc(transactionSchema.datetime)],
      });
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
