"use client";
import { useRouter } from "next/navigation";
import { deleteBudget } from "@/components/budget/budget-actions";
import { Button } from "@/components/ui/button";

const DeleteBudget = ({ id }: { id: string }) => {
	const router = useRouter();
	return (
		<Button
			type="button"
			className="w-full"
			variant="destructive"
			onClick={async () => {
				await deleteBudget(id);
				router.push("/budgets");
			}}
		>
			Delete Category
		</Button>
	);
};

export default DeleteBudget;
