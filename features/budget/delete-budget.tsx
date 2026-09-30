"use client";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBudget } from "@/features/budget/budget-actions";
import { Button } from "@/features/ui/button";

const DeleteBudget = ({ id }: { id: string }) => {
	const router = useRouter();
	return (
		<Button
			size="sm"
			variant="destructive"
			onClick={async () => {
				await deleteBudget(id);
				router.push("/budgets");
			}}
		>
			<TrashIcon />
			Delete Budget
		</Button>
	);
};

export default DeleteBudget;
