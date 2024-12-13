import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { TableEmptyState } from "@/app/dashboard/recurring/table-empty-state";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";

const RecurringTransactions = async () => {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions_recurring")
    .select();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Interval</TableHead>
          <TableHead>Next Run</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.length === 0 ? (
          <TableEmptyState
            description="Recurring transactions simplify your finances."
            title="No recurring transactions"
            colSpan={4}
            actionLabel="Dashboard"
            link="/dashboard"
          />
        ) : (
          transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <TransactionAmount
                  amount={transaction.amount}
                  type={transaction.type}
                />
              </TableCell>
              <TableCell>{transaction.interval}</TableCell>
              <TableCell>{transaction.next_run}</TableCell>

              <TableCell>
                <Link href={`/dashboard/recurring/${transaction.id}`}>
                  <ArrowRight size="18" />
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RecurringTransactions;
