import { CategoryCard } from "@/app/(dashboard)/categories/category-card";
import { defaultCategories } from "@/app/(dashboard)/categories/default-categories";
import { dbTransaction } from "@/drizzle/client";

const CategoryList = async () => {
	const categories = await dbTransaction((tx) => {
		return tx.query.categories.findMany({
			orderBy: {
				name: "asc",
			},
		});
	});

	const existingCategories = categories.map((category) => category.name);

	const orderedCategories = [
		...categories,
		...defaultCategories.filter((category) => !existingCategories.includes(category.name)),
	];

	return (
		<div className="grid grid-cols-2 gap-x-2 gap-y-2 lg:grid-cols-4">
			{orderedCategories.map((category) => (
				<CategoryCard
					key={category.name}
					category={category}
					exists={existingCategories.includes(category.name)}
				/>
			))}
		</div>
	);
};

export default CategoryList;
