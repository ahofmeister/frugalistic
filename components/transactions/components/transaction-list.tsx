"use client";
import { formatDate } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import CategoryColor from "@/components/categories/category-color";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TransactionWithCategory } from "@/types";

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="text-muted-foreground mb-2">
        {transactions.length} transactions
      </div>
      <Table>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Transaction available
              </TableCell>
            </TableRow>
          )}

          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/transactions/edit/${transaction.id}`)
              }
            >
              <TableCell className="flex text-left">
                {formatDate(transaction.datetime, "EEE dd. MMM")}
              </TableCell>

              <TableCell className="text-left">
                <div className="flex gap-x-1">
                  {transaction.description}
                  {transaction.recurring_transaction && (
                    <RefreshCw
                      className="h-4 w-4 text-muted-foreground"
                      aria-label="Recurring transaction"
                    />
                  )}
                </div>
              </TableCell>

              <TableCell className="text-left ">
                <div className="flex gap-x-2 items-center">
                  <CategoryColor color={transaction.category?.color} />
                  {transaction.category?.name}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <TransactionAmount
                  amount={transaction.amount}
                  type={transaction.type}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
