"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/ui/popover";
import { Separator } from "@/features/ui/separator";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
	colours?: readonly string[];
	value: string;
	onChangeAction: (color: string) => void;
	onBlurAction?: () => void;
	disabled?: boolean;
	className?: string;
};

export const ColourPicker = ({
	colours,
	value,
	onChangeAction,
	onBlurAction,
	disabled,
	className,
}: ColorPickerProps) => {
	const [open, setOpen] = useState(false);
	const parsedValue = value || "#FFFFFF";

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					onBlurAction?.();
				}
			}}
		>
			<PopoverTrigger asChild disabled={disabled}>
				<Button
					type="button"
					variant="outline"
					className={cn("w-full justify-start gap-x-3 font-normal", className)}
				>
					<span className="size-5 rounded-sm" style={{ backgroundColor: parsedValue }} />
					<span className="uppercase">{value || "Select color"}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 space-y-4" align="start">
				{colours && (
					<>
						<div className="grid grid-cols-7 gap-3">
							{colours?.map((color) => {
								const selected = value.toLowerCase() === color.toLowerCase();

								return (
									<Button
										key={color}
										type="button"
										size="icon"
										variant="outline"
										aria-label={color}
										aria-pressed={selected}
										className={cn(
											"size-5 rounded-sm border-2 transition-transform hover:scale-110",
											selected ? "border-foreground" : "border-transparent",
										)}
										style={{ backgroundColor: color }}
										onClick={() => onChangeAction(color)}
									/>
								);
							})}
						</div>

						<Separator />
					</>
				)}

				<HexColorPicker color={parsedValue} onChange={onChangeAction} className="w-full!" />
				<Input
					maxLength={7}
					value={parsedValue}
					onChange={(e) => onChangeAction(e.currentTarget.value)}
				/>
			</PopoverContent>
		</Popover>
	);
};
