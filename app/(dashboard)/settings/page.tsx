import { Suspense } from "react";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { SettingsForm } from "@/app/(dashboard)/settings/settingsForm";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

async function DateFormatSetting() {
	const settings = await getSettings();

	return <SettingsForm initialDateFormat={settings.date_format} settingsId={settings.id} />;
}

export default async function SettingsPage() {
	return (
		<div className="space-y-2 max-w-md">
			<Label className="text-sm font-medium">Date Format</Label>
			<Suspense fallback={<Skeleton className="h-10" />}>
				<DateFormatSetting />
			</Suspense>
		</div>
	);
}
