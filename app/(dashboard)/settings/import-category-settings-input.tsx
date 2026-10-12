"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import type { categories } from "@/drizzle/schema";
import CategoryNameColor from "@/features/transactions/components/category-name-color";
import { Label } from "@/features/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Spinner } from "@/features/ui/spinner";

export function ImportCategorySettingsInput({
	initialCategoryId,
	allCategories,
}: {
	initialCategoryId?: string | null;
	allCategories: (typeof categories.$inferSelect)[];
}) {
	const [categoryId, setCategoryId] = useState(initialCategoryId);
	const [isPending, startTransition] = useTransition();

	return (
		<div>
			<Label className="text-sm font-medium">Default Import Category</Label>
			<div className="relative">
				<Select
					onValueChange={async (value) => {
						setCategoryId(value);
						startTransition(async () => {
							try {
								await updateSettings({ importDefaultCategory: value });
							} catch (error) {
								console.error(error);
							}
						});
					}}
					value={categoryId ?? ""}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{allCategories?.map((category) => (
							<SelectItem key={category.id} value={category.id}>
								<CategoryNameColor name={category.name} color={category.color} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">{isPending && <Spinner />}</div>
			</div>
		</div>
	);
}
