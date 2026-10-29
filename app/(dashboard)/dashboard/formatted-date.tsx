"use client";
import { formatDate } from "date-fns";
import { useSettings } from "@/app/(dashboard)/settings/settings-provider";

const FormattedDate = ({ date }: { date: string }) => {
	const settings = useSettings();

	return formatDate(date, settings.dateFormat);
};

export default FormattedDate;
