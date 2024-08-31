import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import InvokeRecurringTransactions from "@/app/dashboard/recurring/invoke-recurring-transactions";
import TransactionAmount from "@/components/transactions/components/TransactionAmount";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecurringTransaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: transactions } = await supabase
    .from("transactions_recurring")
    .select()
    .returns<RecurringTransaction[]>();

  return (
    <>
      <InvokeRecurringTransactions />
      <div className="flex gap-10">
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
            {transactions?.map((transaction) => (
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
                    <Pencil1Icon />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
