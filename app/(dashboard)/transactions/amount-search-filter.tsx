"use client";
import { parseAsInteger, useQueryState } from "nuqs";

import AmountInput from "@/features/transactions/components/amount-input";

const AmountSearchFilter = (props: { paramName: string; placeholder: string; value?: string }) => {
	const [value, setValue] = useQueryState(
		props.paramName,
		parseAsInteger.withOptions({
			shallow: false,
		}),
	);

	return (
		<AmountInput
			value={Number(value)}
			onChange={async (val) => {
				await setValue(val);
			}}
		/>
	);
};

export default AmountSearchFilter;
