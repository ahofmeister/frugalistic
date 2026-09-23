import { Suspense } from "react";
import { DateFormatSettingsInput } from "@/app/(dashboard)/settings/date-format-settings-input";
import { ImportCategorySettingsInput } from "@/app/(dashboard)/settings/import-category-settings-input";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getCategories } from "@/components/categories/categories-api";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

async function DateFormatSettings() {
	const settings = await getSettings();

	return (
		<DateFormatSettingsInput initialDateFormat={settings.dateFormat} settingsId={settings.id} />
	);
}

async function ImportCategorySettings() {
	const settings = await getSettings();
	const categories = await getCategories();

	return (
		<ImportCategorySettingsInput
			initialCategoryId={settings.importDefaultCategory}
			settingsId={settings.id}
			allCategories={categories}
		/>
	);
}

export default async function SettingsPage() {
	return (
		<div className="space-y-6 max-w-md">
			<Suspense fallback={<Skeleton className="h-10" />}>
				<DateFormatSettings />
			</Suspense>
			<Separator />
			<Suspense fallback={<Skeleton className="h-10" />}>
				<ImportCategorySettings />
			</Suspense>
		</div>
	);
}
