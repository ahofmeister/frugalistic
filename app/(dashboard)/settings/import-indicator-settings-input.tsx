"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import type { ImportIndicator } from "@/drizzle/schema";
import { Label } from "@/features/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { Spinner } from "@/features/ui/spinner";

const options = [
	{ value: "none", label: "None" },
	{ value: "both", label: "Imported and manual" },
	{ value: "imported", label: "Imported only" },
	{ value: "manual", label: "Manual only" },
] as const satisfies readonly { value: ImportIndicator; label: string }[];

export function ImportIndicatorSettingsInput({
	initialImportIndicator,
}: {
	initialImportIndicator: ImportIndicator;
}) {
	const [importIndicator, setImportIndicator] = useState(initialImportIndicator);
	const [isPending, startTransition] = useTransition();

	const handleChange = (value: ImportIndicator) => {
		if (value === importIndicator) {
			return;
		}

		setImportIndicator(value);

		startTransition(async () => {
			await updateSettings({ importIndicator: value });
		});
	};

	return (
		<div>
			<Label className="text-sm font-medium">Show import indicator for</Label>
			<div className="relative">
				<Select value={importIndicator} onValueChange={handleChange}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="absolute right-10 top-1/2 -translate-y-1/2">{isPending && <Spinner />}</div>
			</div>
		</div>
	);
}
