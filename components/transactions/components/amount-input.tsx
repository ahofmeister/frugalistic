import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PayPalLikeInputProps {
  name: string;
  control: any;
}

const PayPalLikeInput: React.FC<PayPalLikeInputProps> = ({ name, control }) => {
  const formatInput = (numericValue: string): string => {
    numericValue = numericValue.padStart(3, "0");
    const cents = numericValue.slice(-2);
    let integerPart = numericValue.slice(0, -2);
    integerPart = integerPart.replace(/^0+(?!$)/, "");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${integerPart},${cents}`;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || "0,00"}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, "");
                const formattedValue = formatInput(inputValue);
                field.onChange(formattedValue);
              }}
              onKeyDown={(e) => {
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

                let numericValue = (field.value || "0,00").replace(/\D/g, "");

                if (/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                  numericValue += e.key;
                  const formattedValue = formatInput(numericValue);
                  field.onChange(formattedValue);
                }

                if (e.key === "Backspace") {
                  e.preventDefault();
                  numericValue = numericValue?.slice(0, -1);
                  if (numericValue.length === 0) {
                    field.onChange("0,00");
                  } else {
                    const formattedValue = formatInput(numericValue);
                    field.onChange(formattedValue);
                  }
                }

                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                }
              }}
              onClick={(e) => e.preventDefault()} // Disable cursor click
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PayPalLikeInput;
