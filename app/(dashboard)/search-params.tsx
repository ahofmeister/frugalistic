import { createLoader, createParser, parseAsInteger } from "nuqs/server";

import type { Period } from "@/components/dashboard/period-selector";

const parsePeriod = createParser({
	parse(queryValue) {
		return queryValue as Period;
	},
	serialize(value) {
		return value;
	},
});

export const dashboardSearchParams = {
	year: parseAsInteger.withDefault(new Date().getFullYear()),
	month: parseAsInteger.withDefault(new Date().getMonth()),
	period: parsePeriod.withDefault("month"),
};

export const loadSearchParams = createLoader(dashboardSearchParams);
