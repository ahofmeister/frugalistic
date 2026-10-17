"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import { Spinner } from "@/features/ui/spinner";

export function DueTransactionReminderDaysSettingsInput({ initialDays }: { initialDays: number }) {
	const [days, setDays] = useState(initialDays);
	const [isPending, startTransition] = useTransition();

	const handleBlur = () => {
		startTransition(async () => {
			await updateSettings({ dueTransactionReminderDays: days });
		});
	};

	return (
		<div>
			<Label className="text-sm font-medium">Due Transaction Notification Days</Label>
			<div className="relative">
				<Input
					value={days}
					type="number"
					min={0}
					max={365}
					onChange={(e) => setDays(Number(e.target.value))}
					onBlur={handleBlur}
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">{isPending && <Spinner />}</div>
			</div>
		</div>
	);
}
