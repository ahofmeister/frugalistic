import type React from "react";

import { Input } from "@/features/ui/input";

interface AmountInputProps {
	value: string;
	onChange: (rawValue: string) => void;
}

const normalize = (digits: string): string => digits.replace(/^0+/, "");

const formatInput = (digits: string): string => {
	const padded = digits.padStart(3, "0");
	const cents = padded.slice(-2);
	const integerPart = padded
		.slice(0, -2)
		.replace(/^0+(?!$)/, "")
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return `${integerPart},${cents}`;
};

const getDecimalIndex = (cleaned: string): number => {
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

const parsePastedAmount = (text: string): string | null => {
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

	return normalize(String(cents));
};

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(normalize(e.target.value.replace(/\D/g, "")));
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const parsed = parsePastedAmount(e.clipboardData.getData("text"));

		if (parsed !== null) {
			onChange(parsed);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

		if ((e.ctrlKey || e.metaKey) && ["v", "c", "x", "a"].includes(e.key.toLowerCase())) {
			return;
		}

		if (/^[0-9]$/.test(e.key)) {
			e.preventDefault();
			onChange(normalize(value + e.key));
			return;
		}

		if (e.key === "Backspace") {
			e.preventDefault();
			onChange(value.slice(0, -1));
			return;
		}

		if (!allowedKeys.includes(e.key)) {
			e.preventDefault();
		}
	};

	return (
		<Input
			value={formatInput(value)}
			inputMode="numeric"
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
		/>
	);
};

export default AmountInput;
