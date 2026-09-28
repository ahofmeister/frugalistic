import type React from "react";

import { Input } from "@/components/ui/input";

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

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(normalize(e.target.value.replace(/\D/g, "")));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

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
		/>
	);
};

export default AmountInput;
