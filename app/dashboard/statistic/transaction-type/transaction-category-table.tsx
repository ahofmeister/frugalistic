"use client";
import { format } from "date-fns";
import React from "react";

import TransactionAmount, {
  formatAmount,
} from "@/components/transactions/components/transaction-amount";
import { TransactionTotalByMonth } from "@/components/transactions/transactions-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionTotal {
  category_color: string;
  category_name: string;
  month: number;
  total: number;
}

interface MonthCategoryTotals {
  month: number;
  total: number;

  [category: string]: number;
}

const transformData = (data: TransactionTotal[]): MonthCategoryTotals[] => {
  const monthlyTotals: Record<number, MonthCategoryTotals> = {};

  data.forEach(({ month, category_name, total }) => {
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { month, total: 0 };
    }

    if (category_name !== null) {
      if (!monthlyTotals[month][category_name]) {
        monthlyTotals[month][category_name] = 0;
      }
      monthlyTotals[month][category_name] += total;
    }

    monthlyTotals[month].total += total;
  });

  return Object.values(monthlyTotals);
};

const onlyUnique = (value: string, index: number, array: string[]) =>
  array.indexOf(value) === index;

const TransactionCategoryTable = ({
  data,
}: {
  data: TransactionTotalByMonth[];
}) => {
  const names = data
    .map((transaction) => transaction.category_name)
    .filter(onlyUnique);

  const dataTransformed = transformData(data.filter((x) => x.total > 0));

  const categoryAverages: Record<string, number> = names.reduce(
    (acc, name) => {
      const total = dataTransformed.reduce(
        (sum, row) => sum + (row[name] || 0),
        0,
      );
      const count = dataTransformed.length;
      acc[name] = count > 0 ? total / count : 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalAverage =
    dataTransformed.reduce((sum, row) => sum + row.total, 0) /
    dataTransformed.length;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-semibold">Category</TableCell>
            <TableCell className="font-semibold">Average</TableCell>
            {dataTransformed.map((row) => (
              <TableCell key={row.month}>
                <div className="font-semibold">
                  {format(new Date(2024, row.month - 1, 1), "LLLL")}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {names.map((name) => {
            // Find the expenses-category color for this name
            const categoryData = data.find(
              (transaction) => transaction.category_name === name,
            );
            const categoryColor = categoryData?.category_color || "#000"; // Default to black if not found
            return (
              <TableRow key={name} style={{ color: categoryColor }}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <TransactionAmount amount={categoryAverages[name]} />
                </TableCell>
                {dataTransformed.map((row) => (
                  <TableCell key={`${row.month}-${name}`}>
                    {row[name] ? formatAmount(row[name]) : "-"}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              <TransactionAmount amount={totalAverage} />
            </TableCell>
            {dataTransformed.map((row) => (
              <TableCell key={`total-${row.month}`}>
                <TransactionAmount amount={row.total} />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionCategoryTable;
