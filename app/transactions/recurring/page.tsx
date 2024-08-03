import { redirect } from "next/navigation";
import React from "react";

import InvokeRecurringTransactions from "@/app/transactions/recurring/invoke-recurring-transactions";
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
              <TableHead className="">Description</TableHead>
              <TableHead className="">Amount</TableHead>
              <TableHead className="">Interval</TableHead>
              <TableHead className="">Next Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id} className="">
                <TableCell className="">{transaction.description}</TableCell>
                <TableCell className="">
                  <TransactionAmount
                    amount={transaction.amount}
                    type={transaction.type}
                  />
                </TableCell>
                <TableCell className="">{transaction.interval}</TableCell>
                <TableCell className="">{transaction.next_run}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
