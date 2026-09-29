"use client";
import { Plus } from "lucide-react";
import type { categories } from "@/drizzle/schema";
import { createCategory } from "@/features/categories/categories-api";
import { Button } from "@/features/ui/button";

const AddCategory = ({ category }: { category: typeof categories.$inferInsert }) => (
	<Button size="icon" variant="outline" onClick={() => createCategory(category)}>
		<Plus />
	</Button>
);

export default AddCategory;
