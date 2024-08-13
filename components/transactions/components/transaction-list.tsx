"use client";
import { Pencil1Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { formatDate } from "date-fns";
import Link from "next/link";

import TransactionAmount from "@/components/transactions/components/TransactionAmount";
import {
  deleteTransaction,
  makeTransactionRecurring,
} from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransactionWithCategory } from "@/types";

export default function TransactionList({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) {
  return (
    <div className="w-full ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Date</TableHead>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-left">Category</TableHead>
            <TableHead className="text-left">Division</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="text-center">
              <TableCell className="text-left flex">
                <div className="items-center justify-center text-center">
                  {formatDate(transaction.datetime, "EEE")},{" "}
                  {formatDate(transaction.datetime, "dd. MMM")}
                </div>
              </TableCell>
              <TableCell className="text-left">
                {transaction.description}
              </TableCell>
              <TableCell className="text-left flex items-center">
                <div
                  className="flex w-1.5 mx-2"
                  style={{
                    backgroundColor: transaction.category
                      ? transaction.category.color!
                      : "",
                  }}
                >
                  &nbsp;
                </div>
                {transaction.category?.name}
              </TableCell>
              <TableCell className="text-left">
                {transaction.category?.division}
              </TableCell>
              <TableCell className="text-right">
                <TransactionAmount
                  amount={transaction.amount}
                  type={transaction.type}
                />
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                <Link href={`transactions/edit/${transaction.id}`}>
                  <Button variant="default" size="icon">
                    <Pencil1Icon />
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  <TrashIcon />
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() =>
                          makeTransactionRecurring(transaction, "monthly")
                        }
                      >
                        <ReloadIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Monthly</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
