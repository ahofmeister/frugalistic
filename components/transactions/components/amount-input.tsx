import type React from "react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface AmountInputProps {
	value: string;
	onChange: (rawValue: string) => void;
}

const formatInput = (numericValue: string): string => {
	numericValue = numericValue.padStart(3, "0");
	const cents = numericValue.slice(-2);
	let integerPart = numericValue.slice(0, -2);
	integerPart = integerPart.replace(/^0+(?!$)/, "");
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return `${integerPart},${cents}`;
};

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
	const [inputValue, setInputValue] = useState(formatInput(value));

	useEffect(() => {
		setInputValue(formatInput(value));
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/\D/g, "");
		setInputValue(formatInput(rawValue));
		onChange(rawValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

		if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
			e.preventDefault();
			return;
		}

		let numericValue = value;

		if (/^[0-9]$/.test(e.key)) {
			e.preventDefault();
			numericValue += e.key;
			const formattedValue = formatInput(numericValue);
			setInputValue(formattedValue);
			onChange(numericValue);
		}

		if (e.key === "Backspace") {
			e.preventDefault();
			numericValue = numericValue.slice(0, -1);
			setInputValue(numericValue.length === 0 ? "0,00" : formatInput(numericValue));
			onChange(numericValue);
		}
	};

	return (
		<Input
			value={inputValue}
			inputMode="numeric"
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	);
};

export default AmountInput;
