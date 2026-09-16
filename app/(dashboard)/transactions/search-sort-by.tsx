"use client";
import { parseAsString, useQueryState } from "nuqs";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type { transactions } from "@/drizzle/schema/transaction-schema";

const SearchSortBy = () => {
	const [sortBy, setSortBy] = useQueryState(
		"sortBy",
		parseAsString.withDefault("").withOptions({
			shallow: false,
		}),
	);

	const transactionKeys = [
		"amount",
		"datetime",
		"description",
	] as (keyof typeof transactions.$inferSelect)[];

	return (
		<Select
			value={sortBy}
			onValueChange={async (value: string) => {
				await setSortBy(value as keyof typeof transactions.$inferSelect);
			}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Sort By" />
			</SelectTrigger>
			<SelectContent>
				{transactionKeys.map((key) => (
					<SelectItem key={key} value={key}>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default SearchSortBy;
