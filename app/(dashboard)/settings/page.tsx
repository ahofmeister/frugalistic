import { Suspense } from "react";
import { DateFormatSettingsInput } from "@/app/(dashboard)/settings/date-format-settings-input";
import { DueTransactionReminderDaysSettingsInput } from "@/app/(dashboard)/settings/due-transaction-reminder-days-settings-input";
import { ImportCategorySettingsInput } from "@/app/(dashboard)/settings/import-category-settings-input";
import { ImportIndicatorSettingsInput } from "@/app/(dashboard)/settings/import-indicator-settings-input";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getCategories } from "@/features/categories/categories-api";

async function SettingsLoader() {
	const settings = await getSettings();
	const categories = await getCategories();

	return (
		<div className="space-y-6 max-w-md">
			<DateFormatSettingsInput initialDateFormat={settings.dateFormat} />
			<ImportCategorySettingsInput
				initialCategoryId={settings.importDefaultCategory}
				allCategories={categories}
			/>
			<ImportIndicatorSettingsInput initialImportIndicator={settings.importIndicator} />

			<DueTransactionReminderDaysSettingsInput initialDays={settings.dueTransactionReminderDays} />
		</div>
	);
}

export default async function SettingsPage() {
	return (
		<Suspense>
			<SettingsLoader />
		</Suspense>
	);
}
