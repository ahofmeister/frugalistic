"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

const SelectYear = (props: { min?: number; max?: number }) => {
	const [year, setYear] = useQueryState(
		"year",
		parseAsInteger.withDefault(new Date().getFullYear()).withOptions({
			shallow: false,
		}),
	);

	return (
		<div className="flex gap-x-4 items-center">
			<Button
				disabled={props.min !== undefined && year <= props.min}
				variant="outline"
				size="icon"
				onClick={() => setYear(year - 1)}
			>
				<ChevronLeft />
			</Button>
			<div className="font-bold text-xl">{year}</div>
			<Button
				disabled={props.max !== undefined && year >= props.max}
				variant="outline"
				size="icon"
				onClick={() => setYear(year + 1)}
			>
				<ChevronRight />
			</Button>
		</div>
	);
};

export default SelectYear;
