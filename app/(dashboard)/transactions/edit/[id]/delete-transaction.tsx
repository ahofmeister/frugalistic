"use client";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteTransaction } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

const DeleteTransaction = (props: { id: string }) => {
	const [isDialogOpen, setIsDialogOpen] = useQueryState(
		"deleteTransaction",
		parseAsBoolean.withDefault(false),
	);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDelete = async () => {
		startTransition(async () => {
			try {
				const { error } = await deleteTransaction(props.id);
				if (error) {
					toast.error("Failed to delete the transaction. Please try again later.");
				} else {
					toast.success("The transaction has been successfully removed.");
					void setIsDialogOpen(false);
					router.push("/dashboard");
				}
			} catch (error) {
				console.error("Error deleting transaction:", error);
				toast.error("An unexpected error occurred. Please try again.");
			}
		});
	};

	return (
		<>
			<Button
				type="button"
				className="w-full"
				variant="destructive"
				onClick={() => setIsDialogOpen(true)}
			>
				Delete Transaction
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the transaction.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
							Cancel
						</Button>
						<Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
							{isPending ? <Spinner /> : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteTransaction;
