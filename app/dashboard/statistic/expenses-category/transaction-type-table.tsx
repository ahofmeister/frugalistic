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

  const totals = filteredTotals.reduce(
    (acc, { expense, income, savings }) => ({
      expense: acc.expense + expense,
      income: acc.income + income,
      savings: acc.savings + savings,
    }),
    { expense: 0, income: 0, savings: 0 },
  );

  const averages = {
    expense: totals.expense / filteredTotals.length,
    income: totals.income / filteredTotals.length,
    savings: totals.savings / filteredTotals.length,
  };

  const calculateLeftOver = (
    income: number,
    expense: number,
    savings: number,
  ) => income - expense - savings;

  const totalLeftOver = calculateLeftOver(
    totals.income,
    totals.expense,
    totals.savings,
  );
  const averageLeftOver = calculateLeftOver(
    averages.income,
    averages.expense,
    averages.savings,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Total</TableHead>
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
          <TableCell>
            <TransactionAmount amount={totals.income} />
          </TableCell>
          <TableCell>
            <TransactionAmount amount={averages.income} />
          </TableCell>
          {filteredTotals.map(({ month, income }) => (
            <TableCell key={month}>
              <TransactionAmount amount={income} />
            </TableCell>
          ))}
        </TableRow>

        <TableRow style={{ color: transactionColors.expense }}>
          <TableCell>Expense</TableCell>
          <TableCell>
            <TransactionAmount amount={totals.expense} />
          </TableCell>
          <TableCell>
            <TransactionAmount amount={averages.expense} />
          </TableCell>
          {filteredTotals.map(({ month, expense }) => (
            <TableCell key={month}>
              <TransactionAmount amount={expense} />
            </TableCell>
          ))}
        </TableRow>

        <TableRow style={{ color: transactionColors.savings }}>
          <TableCell>Savings</TableCell>
          <TableCell>
            <TransactionAmount amount={totals.savings} />
          </TableCell>
          <TableCell>
            <TransactionAmount amount={averages.savings} />
          </TableCell>
          {filteredTotals.map(({ month, savings }) => (
            <TableCell key={month}>
              <TransactionAmount amount={savings} />
            </TableCell>
          ))}
        </TableRow>

        <TableRow style={{ color: transactionColors.leftOver }}>
          <TableCell>Left Over</TableCell>
          <TableCell>
            <TransactionAmount amount={totalLeftOver} />
          </TableCell>
          <TableCell>
            <TransactionAmount amount={averageLeftOver} />
          </TableCell>
          {filteredTotals.map(({ month, income, expense, savings }) => (
            <TableCell key={month}>
              <TransactionAmount
                amount={calculateLeftOver(income, expense, savings)}
              />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
