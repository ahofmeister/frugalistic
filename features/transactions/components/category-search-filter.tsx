"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import type { categories } from "@/drizzle/schema";
import { getCategories } from "@/features/categories/categories-api";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";

const CategorySearchFilter = () => {
	const [selectedCategories, setSelectedCategories] = useState<(typeof categories.$inferSelect)[]>(
		[],
	);

	const [category, setCategoryId] = useQueryState("category", {
		shallow: false,
	});

	useEffect(() => {
		const fetchCategories = async () => {
			const data = await getCategories();
			setSelectedCategories(data);
		};
		void fetchCategories();
	}, []);

	return (
		<Select
			value={category ?? undefined}
			onValueChange={(value) => {
				void setCategoryId(value);
			}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select a category" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={null as unknown as string}>Select Category</SelectItem>
				{selectedCategories?.map((category) => (
					<SelectItem key={category.id} value={category.name}>
						<CategoryNameColor name={category.name} color={category.color} />
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default CategorySearchFilter;
