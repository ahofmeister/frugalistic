import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import type { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import TransactionList from "@/components/transactions/components/transaction-list";
import { searchTransactions } from "@/components/transactions/transactions-api";

const TransactionsSearchResult = async (props: {
	filter: Promise<SearchFilter>;
}) => {
	const filter = await props.filter;
	const data = await searchTransactions(filter);
	const settings = await getSettings();

	return (
		<TransactionList transactions={data} dateFormat={settings.date_format} />
	);
};

export default TransactionsSearchResult;
