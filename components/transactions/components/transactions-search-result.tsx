import React from "react";

import TransactionList from "@/components/transactions/components/transaction-list";
import { searchTransactions } from "@/components/transactions/transactions-api";

const TransactionsPage2 = async ({
  dateFrom,
  dateTo,
  description,
}: {
  dateFrom: string;
  dateTo: string;
  description: string;
}) => {
  const data = await searchTransactions({
    dateFrom,
    dateTo,
    description,
  });

  return (
    <div>
      <TransactionList transactions={data} />
    </div>
  );
};

export default TransactionsPage2;
