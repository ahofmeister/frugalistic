import { notFound } from "next/navigation";
import { dbTransaction } from "@/drizzle/client";
import CategoryForm from "@/features/categories/category-form";

export async function CategoryFormWithData(props: { categoryId: Promise<string> }) {
	const id = await props.categoryId;

	const category = await dbTransaction((tx) => {
		return tx.query.categories.findFirst({
			where: {
				id,
			},
		});
	});

	if (!category) {
		notFound();
	}

	return <CategoryForm category={category} />;
}
