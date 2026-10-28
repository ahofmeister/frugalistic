"use client";
import { useSettings } from "@/app/(dashboard)/settings/settings-provider";
import type { TransactionTypeWithLeftover } from "@/drizzle/schema";
import { formatAmount } from "@/features/transactions/amount-parser";
import { getTextColor } from "@/features/transactions/colors";
import { cn } from "@/lib/utils";

const DisplayAmount = ({
	amount,
	type,
	className,
}: {
	amount: number;
	type?: TransactionTypeWithLeftover;
	className?: string;
}) => {
	const typeClass = getTextColor(type);

	const settings = useSettings();

	return (
		<span className={cn(typeClass, className)}>
			{formatAmount(amount, settings.transactionDisplayAmount)}
		</span>
	);
};

export default DisplayAmount;
