"use client";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/components/categories/categories-api";
import { Button } from "@/components/ui/button";

const DeleteCategory = ({ id }: { id: string }) => {
	const router = useRouter();
	return (
		<Button
			type="button"
			className="w-full"
			variant="destructive"
			onClick={async () => {
				await deleteCategory(id);
				router.push("/categories");
			}}
		>
			Delete Category
		</Button>
	);
};

export default DeleteCategory;
