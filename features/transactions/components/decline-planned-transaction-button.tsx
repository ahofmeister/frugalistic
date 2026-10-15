import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { declinePlannedTransaction } from "@/features/transactions/transactions-api";
import { Button } from "@/features/ui/button";

const DeclinePlannedTransactionButton = ({ transactionId }: { transactionId: string }) => {
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={async (event) => {
				event.stopPropagation();
				event.preventDefault();
				const result = await declinePlannedTransaction(transactionId);

				if (result.success) {
					toast.success(result.message);
				} else {
					toast.error(result.message);
				}
			}}
		>
			<XIcon />
		</Button>
	);
};

export default DeclinePlannedTransactionButton;
