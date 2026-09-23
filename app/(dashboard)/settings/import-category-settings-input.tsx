"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { categories } from "@/drizzle/schema";

export function ImportCategorySettingsInput({
	initialCategoryId,
	settingsId,
	allCategories,
}: {
	initialCategoryId?: string | null;
	settingsId: string;
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
							await updateSettings({ importDefaultCategory: value, id: settingsId });
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
								<div className="flex items-center gap-2">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: category.color }}
									/>
									<span>{category.name}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">{isPending && <Spinner />}</div>
			</div>
		</div>
	);
}
