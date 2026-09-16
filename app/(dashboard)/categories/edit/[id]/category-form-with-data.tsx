import { notFound } from "next/navigation";
import CategoryForm from "@/components/categories/category-form";
import { dbTransaction } from "@/drizzle/client";

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
