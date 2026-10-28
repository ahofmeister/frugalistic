"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/(dashboard)/settings/settings-actions";
import {
	amountFormatPresets,
	defaultAmountFormat,
	formatAmount,
	isValidAmountFormat,
} from "@/features/transactions/amount-parser";
import { Button } from "@/features/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/features/ui/dialog";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import { Spinner } from "@/features/ui/spinner";

const sampleAmount = 123456;
const customExamples = ["#.###,##", "#,###.##", "# ###,## €", "#'###.## CHF", "#,##"];

export function AmountDisplaySettingsInput({
	initialDisplayAmount,
}: {
	initialDisplayAmount: string;
}) {
	const savedFormat = initialDisplayAmount || defaultAmountFormat;
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(savedFormat);
	const [isPending, startTransition] = useTransition();

	const nextFormat = draft || defaultAmountFormat;
	const error =
		draft && !isValidAmountFormat(draft)
			? "Use # for the number and different separators, e.g. #.###,## €"
			: null;

	const handleOpenChange = (value: boolean) => {
		setOpen(value);
		if (value) {
			setDraft(savedFormat);
		}
	};

	const handleApply = () => {
		if (error) {
			return;
		}

		if (nextFormat === savedFormat) {
			setOpen(false);
			return;
		}

		startTransition(async () => {
			await updateSettings({ transactionDisplayAmount: nextFormat });
			setOpen(false);
		});
	};

	return (
		<div>
			<Label className="text-sm font-medium">Amount Format</Label>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button variant="outline" className="w-full justify-start font-normal">
						{formatAmount(sampleAmount, savedFormat)}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Amount format</DialogTitle>
					</DialogHeader>
					<div className="max-h-72 overflow-y-auto rounded-md border">
						{amountFormatPresets.map(({ pattern, description }) => (
							<button
								key={pattern}
								type="button"
								aria-pressed={draft === pattern}
								onClick={() => setDraft(pattern)}
								className={`flex w-full items-center justify-between gap-4 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted ${
									draft === pattern ? "bg-muted" : ""
								}`}
							>
								<span>
									<span className="block font-medium">{formatAmount(sampleAmount, pattern)}</span>
									<span className="block text-xs text-muted-foreground">{description}</span>
								</span>
								<span className="text-xs text-muted-foreground">{pattern}</span>
							</button>
						))}
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">Custom format</Label>
						<Input
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							placeholder={defaultAmountFormat}
							aria-invalid={!!error}
						/>
						<div className="text-sm">
							{error ? (
								<span className="text-destructive">{error}</span>
							) : (
								`Sample: ${formatAmount(sampleAmount, nextFormat)}`
							)}
						</div>
						<div className="space-y-1 text-xs text-muted-foreground">
							<div>
								# is the number. Pattern: <span className="font-mono">#x###y##</span>, where x is
								the thousands separator and y is the decimal separator. Both can be any character.
								Leave out x### for no thousands separator. You can add a symbol before or after,
								like € or $.
							</div>
							{customExamples.map((example) => (
								<div key={example}>
									{example} → {formatAmount(sampleAmount, example)}
								</div>
							))}
						</div>
					</div>
					<div className="flex justify-end">
						<Button onClick={handleApply} disabled={!!error || isPending}>
							{isPending ? <Spinner /> : "Apply"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
