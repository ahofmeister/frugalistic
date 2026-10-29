import { format } from "date-fns";
import { FileUpIcon, HandIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useSettings } from "@/app/(dashboard)/settings/settings-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/ui/tooltip";

function IndicatorTooltip({ icon, text }: { icon: ReactNode; text: string }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="text-muted-foreground">{icon}</span>
				</TooltipTrigger>
				<TooltipContent>{text}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function TransactionImportedIndicator({ importedAt }: { importedAt: string | null }) {
	const settings = useSettings();

	const importedIndicator = importedAt ? (
		<IndicatorTooltip
			icon={<FileUpIcon size={10} />}
			text={`Imported on ${format(importedAt, settings.dateFormat)}`}
		/>
	) : null;

	const manualIndicator = importedAt ? null : (
		<IndicatorTooltip icon={<HandIcon size={10} />} text="Added manually" />
	);

	switch (settings.importIndicator) {
		case "none":
			return null;
		case "imported":
			return importedIndicator;
		case "manual":
			return manualIndicator;
		case "both":
			return importedIndicator ?? manualIndicator;
	}
}
