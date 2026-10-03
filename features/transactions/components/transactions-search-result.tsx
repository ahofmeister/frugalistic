import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import TransactionList from "@/features/transactions/components/transaction-list";
import { searchTransactions } from "@/features/transactions/transactions-api";

const TransactionsSearchResult = async (props: { filter: Promise<SearchFilter> }) => {
	const filter = await props.filter;
	const data = await searchTransactions(filter);
	const settings = await getSettings();

	return <TransactionList transactions={data} settings={settings} />;
};

export default TransactionsSearchResult;
