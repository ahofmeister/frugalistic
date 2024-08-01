"use client";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { formatDate } from "date-fns";

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
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Division</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="text-center">
              <TableCell className="text-left">
                <div>
                  {formatDate(transaction.datetime, "EEE")},{" "}
                  {formatDate(transaction.datetime, "dd. MMM")}
                </div>
              </TableCell>
              <TableCell className="">{transaction.description}</TableCell>
              <TableCell className="">{transaction.category?.name}</TableCell>
              <TableCell className="">
                {transaction.category?.division}
              </TableCell>
              <TableCell className="text-right">
                <TransactionAmount
                  amount={transaction.amount}
                  type={transaction.type}
                />
              </TableCell>
              <TableCell className="text-right">
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
