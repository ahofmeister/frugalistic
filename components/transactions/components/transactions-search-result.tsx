import React from "react";

import TransactionList from "@/components/transactions/components/transaction-list";
import { searchTransactions } from "@/components/transactions/transactions-api";
import { TransactionType } from "@/types";

const TransactionsSearchResult = async ({
  dateFrom,
  dateTo,
  description,
  category,
  type,
}: {
  dateFrom: string;
  dateTo: string;
  description: string;
  category: string;
  type: TransactionType;
}) => {
  const data = await searchTransactions({
    dateFrom,
    dateTo,
    description,
    category,
    type,
  });

  return <TransactionList transactions={data} />;
};

export default TransactionsSearchResult;
