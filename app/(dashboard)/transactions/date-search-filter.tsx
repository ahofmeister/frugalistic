"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DateSearchFilter = (props: { paramName: string; label: string }) => {
	const [value, setValue] = useQueryState(
		props.paramName,
		parseAsIsoDate.withOptions({
			shallow: false,
		}),
	);

	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn("justify-start text-left font-normal", !value && "text-muted-foreground")}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value ? format(value, "yyyy-MM-dd") : <span>{props.label}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={value ?? new Date()}
						onSelect={async (date) => {
							if (date) {
								await setValue(date);
							} else {
								await setValue(null);
							}
						}}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DateSearchFilter;
