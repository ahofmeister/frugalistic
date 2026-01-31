"use client";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function SettingsForm({
	initialDateFormat,
	settingsId,
}: {
	initialDateFormat: string;
	settingsId: string;
}) {
	const [dateFormat, setDateFormat] = useState(initialDateFormat);
	const [isPending, startTransition] = useTransition();

	const getError = (fmt: string) => {
		if (!fmt) {
			return "Required";
		}
		if (fmt.length > 20) {
			return "Must be 20 characters or less";
		}
		try {
			format(new Date(), fmt);
			return null;
		} catch {
			return "Invalid format";
		}
	};

	const error = getError(dateFormat);
	const preview = error ? null : `Preview: ${format(new Date(), dateFormat)}`;

	const handleBlur = () => {
		const error = getError(dateFormat);
		if (error || dateFormat === initialDateFormat) {
			return;
		}

		startTransition(async () => {
			await updateSettings({ date_format: dateFormat, id: settingsId });
		});
	};

	return (
		<>
			<div className="relative">
				<Input
					value={dateFormat}
					onChange={(e) => setDateFormat(e.target.value)}
					onBlur={handleBlur}
					placeholder="yyyy-MM-dd"
					className="pr-20"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">{isPending && <Spinner />}</div>
			</div>
			<div className="text-xs text-muted-foreground">
				{error && <span className="text-destructive">{error}</span>}
				{preview && preview}
			</div>
		</>
	);
}
