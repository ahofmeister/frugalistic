export const parsePastedAmount = (text: string): string | null => {
	const cleaned = text.replace(/[^\d.,]/g, "");

	if (!/\d/.test(cleaned)) {
		return null;
	}

	const decimalIndex = getDecimalIndex(cleaned);
	const integerRaw = decimalIndex === -1 ? cleaned : cleaned.slice(0, decimalIndex);
	const fractionRaw = decimalIndex === -1 ? "" : cleaned.slice(decimalIndex + 1);

	const integerDigits = integerRaw.replace(/\D/g, "") || "0";
	const fractionDigits = fractionRaw.replace(/\D/g, "").padEnd(3, "0");

	const roundUp = Number(fractionDigits[2]) >= 5 ? 1 : 0;
	const cents = Number(integerDigits) * 100 + Number(fractionDigits.slice(0, 2)) + roundUp;

	return normalizeAmount(String(cents));
};

export const normalizeAmount = (digits: string): string => digits.replace(/^0+/, "");

export const formatInput = (digits: string): string => {
	const padded = digits.padStart(3, "0");
	const cents = padded.slice(-2);
	const integerPart = padded
		.slice(0, -2)
		.replace(/^0+(?!$)/, "")
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return `${integerPart},${cents}`;
};

export const getDecimalIndex = (cleaned: string): number => {
	const lastDot = cleaned.lastIndexOf(".");
	const lastComma = cleaned.lastIndexOf(",");
	const lastSeparator = Math.max(lastDot, lastComma);

	if (lastSeparator === -1) {
		return -1;
	}

	const separator = cleaned[lastSeparator];
	const hasOtherSeparator = separator === "." ? lastComma !== -1 : lastDot !== -1;

	if (hasOtherSeparator) {
		return lastSeparator;
	}

	const occurrences = cleaned.split(separator).length - 1;

	if (occurrences > 1) {
		return -1;
	}

	const digitsAfter = cleaned.length - lastSeparator - 1;
	const integerPart = cleaned.slice(0, lastSeparator);

	if (digitsAfter === 3 && integerPart !== "0" && integerPart !== "") {
		return -1;
	}

	return lastSeparator;
};

export const defaultAmountFormat = "#.###,## €";

export const amountFormatPresets = [
	{ pattern: "#.###,## €", description: "Point for thousands, comma for decimals, euro after" },
	{ pattern: "#,###.## €", description: "Comma for thousands, point for decimals, euro after" },
	{ pattern: "€ #,###.##", description: "Comma for thousands, point for decimals, euro before" },
	{ pattern: "$#,###.##", description: "Comma for thousands, point for decimals, dollar before" },
	{ pattern: "# ###,## €", description: "Space for thousands, comma for decimals, euro after" },
	{ pattern: "#'###.## CHF", description: "Apostrophe for thousands, point for decimals" },
	{ pattern: "#,## €", description: "Comma for decimals, no thousands separator" },
	{ pattern: "#.##", description: "Point for decimals, no thousands separator" },
	{ pattern: "#,#", description: "One decimal, rounded, no thousands separator" },
	{ pattern: "#", description: "No decimals, rounded, no thousands separator" },
];

export function isPresetAmountFormat(pattern: string) {
	return amountFormatPresets.some((preset) => preset.pattern === pattern);
}

export const thousandsOptions = [
	{ value: "point", label: "Point (1.234)", separator: "." },
	{ value: "comma", label: "Comma (1,234)", separator: "," },
	{ value: "space", label: "Space (1 234)", separator: " " },
	{ value: "apostrophe", label: "Apostrophe (1'234)", separator: "'" },
	{ value: "none", label: "None (1234)", separator: "" },
];

const patternRegex = /(?:#([^#\d])###|#+)(?:([^#\d])(#+))?/;

export function isValidAmountFormat(pattern: string) {
	return patternRegex.test(pattern);
}

export function getDecimalSeparator(pattern: string) {
	return patternRegex.exec(pattern)?.[2] ?? "";
}

export function getThousandsOption(pattern: string) {
	const match = patternRegex.exec(pattern);
	if (!match) {
		return "none";
	}
	const separator = match[1] ?? "";
	return thousandsOptions.find((option) => option.separator === separator)?.value ?? "";
}

export function setThousandsOption(pattern: string, value: string) {
	const match = patternRegex.exec(pattern);
	if (!match) {
		return pattern;
	}
	const separator = thousandsOptions.find((option) => option.value === value)?.separator ?? "";
	const number = separator ? `#${separator}###` : "#";
	const decimals = match[2] ? `${match[2]}${match[3]}` : "";
	return pattern.replace(patternRegex, () => `${number}${decimals}`);
}

export function formatAmount(amount: number, pattern: string = defaultAmountFormat) {
	const validPattern = isValidAmountFormat(pattern) ? pattern : defaultAmountFormat;
	const [, thousands = "", decimalSeparator = "", decimalPlaceholder = ""] = patternRegex.exec(
		validPattern,
	) as RegExpExecArray;

	const decimals = decimalPlaceholder.length;
	const step = 10 ** Math.max(2 - decimals, 0);
	const rounded = Math.round(Math.abs(amount) / step) * step;

	const whole = String(Math.floor(rounded / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
	const fraction = String(rounded % 100)
		.padStart(2, "0")
		.padEnd(decimals, "0")
		.slice(0, decimals);

	const number = decimals > 0 ? `${whole}${decimalSeparator}${fraction}` : whole;
	const text = validPattern.replace(patternRegex, () => number);

	return amount < 0 && rounded > 0 ? `-${text}` : text;
}
