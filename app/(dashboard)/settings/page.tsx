import { Suspense } from "react";
import { DateFormatSettingsInput } from "@/app/(dashboard)/settings/date-format-settings-input";
import { ImportCategorySettingsInput } from "@/app/(dashboard)/settings/import-category-settings-input";
import { ImportIndicatorSettingsInput } from "@/app/(dashboard)/settings/import-indicator-settings-input";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getCategories } from "@/features/categories/categories-api";
import { Separator } from "@/features/ui/separator";
import { Skeleton } from "@/features/ui/skeleton";

async function DateFormatSettings() {
	const settings = await getSettings();

	return <DateFormatSettingsInput initialDateFormat={settings.dateFormat} />;
}

async function ImportCategorySettings() {
	const settings = await getSettings();
	const categories = await getCategories();

	return (
		<ImportCategorySettingsInput
			initialCategoryId={settings.importDefaultCategory}
			allCategories={categories}
		/>
	);
}

async function ImportIndicatorSettings() {
	const settings = await getSettings();

	return <ImportIndicatorSettingsInput initialImportIndicator={settings.importIndicator} />;
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

			<Separator />

			<Suspense>
				<ImportIndicatorSettings />
			</Suspense>
		</div>
	);
}
