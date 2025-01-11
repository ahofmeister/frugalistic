import React from "react";

import TransactionList from "@/components/transactions/components/transaction-list";
import { searchTransactions } from "@/components/transactions/transactions-api";
import { TransactionType } from "@/types";

const TransactionsSearchResult = async ({
  dateFrom,
  dateTo,
  amountFrom,
  amountTo,
  description,
  category,
  type,
}: {
  dateFrom: string;
  dateTo: string;
  amountFrom: string;
  amountTo: string;
  description: string;
  category: string;
  type: TransactionType;
}) => {
  const data = await searchTransactions({
    dateFrom,
    amountFrom,
    amountTo,
    dateTo,
    description,
    category,
    type,
  });

  return <TransactionList transactions={data} />;
};

export default TransactionsSearchResult;
