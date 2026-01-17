"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import CategoryColor from "@/components/categories/category-color";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types";
import { createClient } from "@/utils/supabase/client";

const CategorySearchFilter = () => {
	const [categories, setCategories] = useState<Category[]>([]);

	const [category, setCategoryId] = useQueryState("category", {
		shallow: false,
	});

	useEffect(() => {
		const fetchCategories = async () => {
			const supabase = createClient();
			const { data } = await supabase
				.from("categories")
				.select("*")
				.order("name");
			setCategories(data ?? []);
		};
		void fetchCategories();
	}, []);

	return (
		<div>
			<Select
				value={category ?? undefined}
				onValueChange={(value) => {
					void setCategoryId(value);
				}}
			>
				<SelectTrigger className="w-[280px]">
					<SelectValue placeholder="Select a category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={null as unknown as string}>
						Select Category
					</SelectItem>
					{categories?.map((category) => (
						<SelectItem key={category.id} value={category.name}>
							<div className="flex gap-x-2 items-center">
								<CategoryColor color={category.color} />
								{category.name}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CategorySearchFilter;
