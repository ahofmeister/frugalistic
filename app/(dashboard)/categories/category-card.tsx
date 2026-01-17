"use client";
import { useRouter } from "next/navigation";

import AddCategory from "@/components/categories/add-category";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Category, NewCategory } from "@/types";

export function CategoryCard(props: {
	category: Category | NewCategory;
	exists: boolean;
}) {
	const category = props.category;
	const router = useRouter();
	return (
		<Card
			className={cn("flex flex-col justify-between", {
				"cursor-pointer": props.category.id,
				"cursor-default": !props.category.id,
			})}
			onClick={() => {
				if (!props.category.id) {
					return;
				}
				router.push(`/categories/edit/${category.id}`);
			}}
			style={{ color: category.color }}
		>
			<CardHeader>
				<CardTitle>{category.name}</CardTitle>
				<CardDescription className="text-sm text-gray-200 flex-1">
					{category?.description}
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-between">
				{!props.exists && (
					<div className="flex items-center gap-x-2">
						<AddCategory category={category} />
						<div className="text-xs text-muted-foreground">
							Default category
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
