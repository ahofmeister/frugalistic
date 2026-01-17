"use client";
import { parseAsString, useQueryState } from "nuqs";

import AmountInput from "@/components/transactions/components/amount-input";

const AmountSearchFilter = (props: {
	paramName: string;
	placeholder: string;
	value?: string;
}) => {
	const [value, setValue] = useQueryState(
		props.paramName,
		parseAsString.withOptions({
			shallow: false,
		}),
	);

	return (
		<AmountInput
			value={value ?? ""}
			onChange={async (val) => {
				await setValue(val ?? null);
			}}
		/>
	);
};

export default AmountSearchFilter;
