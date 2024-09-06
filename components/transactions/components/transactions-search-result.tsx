import React from "react";
import { searchTransactions } from "@/components/transactions/transactions-api";
import TransactionList from "@/components/transactions/components/transaction-list";

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
