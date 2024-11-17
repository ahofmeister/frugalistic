"use client";
import { format } from "date-fns";
import React from "react";

import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { TransactionTotal } from "@/components/transactions/transactions-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionColors } from "@/utils/transaction/colors";

export default function TransactionTypeTable({
  transactionTotals,
  year,
}: {
  transactionTotals: TransactionTotal[];
  year: number;
}) {
  const filteredTotals = transactionTotals.filter(
    ({ expense, income, savings }) => expense > 0 && income > 0 && savings > 0,
  );

  const averageExpense =
    filteredTotals.reduce((sum, { expense }) => sum + expense, 0) /
    filteredTotals.length;
  const averageIncome =
    filteredTotals.reduce((sum, { income }) => sum + income, 0) /
    filteredTotals.length;
  const averageSavings =
    filteredTotals.reduce((sum, { savings }) => sum + savings, 0) /
    filteredTotals.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Average</TableHead>
          {filteredTotals.map(({ month }) => (
            <TableHead key={month}>
              {format(new Date(year, month - 1, 1), "LLLL")}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow style={{ color: transactionColors.income }}>
          <TableCell>Income</TableCell>
          <TableCell style={{ color: transactionColors.income }}>
            <TransactionAmount amount={averageIncome} />
          </TableCell>
          {filteredTotals.map(({ month, income }) => (
            <TableCell key={month}>
              <TransactionAmount amount={income} />
            </TableCell>
          ))}
        </TableRow>

        <TableRow style={{ color: transactionColors.expense }}>
          <TableCell>Expense</TableCell>

          <TableCell style={{ color: transactionColors.expense }}>
            <TransactionAmount amount={averageExpense} />
          </TableCell>

          {filteredTotals.map(({ month, expense }) => (
            <TableCell key={month}>
              <TransactionAmount amount={expense} />
            </TableCell>
          ))}
        </TableRow>

        <TableRow style={{ color: transactionColors.savings }}>
          <TableCell>Savings</TableCell>
          <TableCell style={{ color: transactionColors.savings }}>
            <TransactionAmount amount={averageSavings} />
          </TableCell>
          {filteredTotals.map(({ month, savings }) => (
            <TableCell key={month}>
              <TransactionAmount amount={savings} />
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Left Over</TableCell>
          <TableCell style={{ color: transactionColors.leftOver }}>
            <TransactionAmount
              amount={averageIncome - averageExpense - averageSavings}
            />
          </TableCell>

          {filteredTotals.map(({ month, income, expense, savings }) => {
            const leftOver = income - expense - savings;
            return (
              <TableCell key={month}>
                <TransactionAmount amount={leftOver} />
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
