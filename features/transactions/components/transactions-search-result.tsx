import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import TransactionList from "@/features/transactions/components/transaction-list";
import { searchTransactions } from "@/features/transactions/transactions-api";

const TransactionsSearchResult = async (props: { filter: Promise<SearchFilter> }) => {
	const filter = await props.filter;
	const data = await searchTransactions(filter);

	return <TransactionList transactions={data} />;
};

export default TransactionsSearchResult;
