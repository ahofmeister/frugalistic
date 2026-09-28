import { getTextColor } from "@/components/transactions/colors";
import type { TransactionTypeWithLeftover } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

export const formatAmount = (input: number) => {
	if (input === 0) {
		return "0";
	}

	return (input / 100).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const TransactionAmount = ({
	amount,
	type,
	className,
}: {
	amount: number;
	type?: TransactionTypeWithLeftover;
	className?: string;
}) => {
	const typeClass = getTextColor(type);

	return <span className={cn(typeClass, className)}>{formatAmount(amount)}</span>;
};

export default TransactionAmount;
