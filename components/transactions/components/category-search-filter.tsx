"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { getCategories } from "@/components/categories/categories-api";
import CategoryColor from "@/components/categories/category-color";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { categories } from "@/drizzle/schema";

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
						<div className="flex gap-x-2 items-center">
							<CategoryColor color={category.color} />
							{category.name}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default CategorySearchFilter;
