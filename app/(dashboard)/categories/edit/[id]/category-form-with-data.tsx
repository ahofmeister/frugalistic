import { notFound } from "next/navigation";
import CategoryForm from "@/components/categories/category-form";
import { createClient } from "@/utils/supabase/server";

export async function CategoryFormWithData(props: {
	categoryId: Promise<string>;
}) {
	const id = await props.categoryId;
	const supabase = await createClient();
	const { data: category } = await supabase
		.from("categories")
		.select("*")
		.eq("id", id)
		.single();

	if (!category) {
		notFound();
	}

	return <CategoryForm category={category} />;
}
