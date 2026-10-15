"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { bookTransaction } from "@/features/transactions/transactions-api";
import { Button } from "@/features/ui/button";

const BookTransactionButton = ({ transactionId }: { transactionId: string }) => {
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={async (event) => {
				event.stopPropagation();
				event.preventDefault();
				const result = await bookTransaction(transactionId);

				if (result.success) {
					toast.success(result.message);
				} else {
					toast.error(result.message);
				}
			}}
		>
			<CheckIcon />
		</Button>
	);
};

export default BookTransactionButton;
