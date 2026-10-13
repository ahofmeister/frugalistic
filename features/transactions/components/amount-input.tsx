import type React from "react";
import {
	formatInput,
	normalizeAmount,
	parsePastedAmount,
} from "@/features/transactions/amount-parser";
import { Input } from "@/features/ui/input";

interface AmountInputProps {
	value: string;
	onChange: (rawValue: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(normalizeAmount(e.target.value.replace(/\D/g, "")));
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
			onChange(normalizeAmount(value + e.key));
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
