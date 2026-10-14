import type React from "react";
import {
	formatInput,
	normalizeAmount,
	parsePastedAmount,
} from "@/features/transactions/amount-parser";
import { Input } from "@/features/ui/input";

interface AmountInputProps {
	value: number;
	onChange: (value: number) => void;
}

const MAX_AMOUNT = 2147483647;

function toAmount(raw: string) {
	const parsed = Math.trunc(Number(raw));
	if (!Number.isFinite(parsed)) {
		return 0;
	}
	return Math.min(Math.max(parsed, 0), MAX_AMOUNT);
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
	const raw = String(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(toAmount(normalizeAmount(e.target.value.replace(/\D/g, ""))));
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const parsed = parsePastedAmount(e.clipboardData.getData("text"));

		if (parsed !== null) {
			onChange(toAmount(parsed));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

		if ((e.ctrlKey || e.metaKey) && ["v", "c", "x", "a"].includes(e.key.toLowerCase())) {
			return;
		}

		if (/^[0-9]$/.test(e.key)) {
			e.preventDefault();
			onChange(toAmount(normalizeAmount(raw + e.key)));
			return;
		}

		if (e.key === "Backspace") {
			e.preventDefault();
			onChange(toAmount(raw.slice(0, -1)));
			return;
		}

		if (!allowedKeys.includes(e.key)) {
			e.preventDefault();
		}
	};

	return (
		<Input
			value={formatInput(raw)}
			inputMode="numeric"
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
		/>
	);
};

export default AmountInput;
