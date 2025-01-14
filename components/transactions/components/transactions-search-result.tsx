import React from "react";

import { SearchFilter } from "@/app/dashboard/search/search-filter";
import TransactionList from "@/components/transactions/components/transaction-list";
import { searchTransactions } from "@/components/transactions/transactions-api";

const TransactionsSearchResult = async (props: { filter: SearchFilter }) => {
  const data = await searchTransactions(props.filter);

  return <TransactionList transactions={data} />;
};

export default TransactionsSearchResult;
