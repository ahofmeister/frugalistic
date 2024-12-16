import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
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
  const [inputValue, setInputValue] = useState(formatInput(value.toString()));

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    const formattedValue = formatInput(inputValue);
    setInputValue(formattedValue);
    onChange(formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    let numericValue = (inputValue || "0,00").replace(/\D/g, "");

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      numericValue += e.key;
      const formattedValue = formatInput(numericValue);
      setInputValue(formattedValue);
      onChange(formattedValue);
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      numericValue = numericValue.slice(0, -1);
      setInputValue(
        numericValue.length === 0 ? "0,00" : formatInput(numericValue),
      );
      onChange(numericValue.length === 0 ? "0,00" : formatInput(numericValue));
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
    }
  };

  return (
    <Input
      value={inputValue}
      inputMode="numeric"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.preventDefault()} // Disable cursor click
    />
  );
};

export default AmountInput;
