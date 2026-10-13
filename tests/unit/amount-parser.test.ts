import { describe, expect, it } from "vitest";
import {
	formatInput,
	getDecimalIndex,
	normalizeAmount,
	parsePastedAmount,
} from "@/features/transactions/amount-parser";

describe("normalizeAmount", () => {
	it.each([
		["", ""],
		["0", ""],
		["00", ""],
		["000", ""],
		["007", "7"],
		["0100", "100"],
		["100", "100"],
		["120", "120"],
		["10", "10"],
	])("normalizes %j to %j", (input, expected) => {
		expect(normalizeAmount(input)).toBe(expected);
	});
});

describe("formatInput", () => {
	describe("small values are padded", () => {
		it.each([
			["", "0,00"],
			["0", "0,00"],
			["000", "0,00"],
			["1", "0,01"],
			["5", "0,05"],
			["12", "0,12"],
			["99", "0,99"],
			["007", "0,07"],
		])("formats %j as %j", (input, expected) => {
			expect(formatInput(input)).toBe(expected);
		});
	});

	describe("values without thousands separators", () => {
		it.each([
			["100", "1,00"],
			["123", "1,23"],
			["1234", "12,34"],
			["12345", "123,45"],
			["99999", "999,99"],
		])("formats %j as %j", (input, expected) => {
			expect(formatInput(input)).toBe(expected);
		});
	});

	describe("values with thousands separators", () => {
		it.each([
			["100000", "1.000,00"],
			["123456", "1.234,56"],
			["1234567", "12.345,67"],
			["12345678", "123.456,78"],
			["123456789", "1.234.567,89"],
			["1000000000", "10.000.000,00"],
		])("formats %j as %j", (input, expected) => {
			expect(formatInput(input)).toBe(expected);
		});
	});
});

describe("getDecimalIndex", () => {
	describe("no separator", () => {
		it.each([[""], ["0"], ["12"], ["123456"]])("returns -1 for %j", (input) => {
			expect(getDecimalIndex(input)).toBe(-1);
		});
	});

	describe("both separators present", () => {
		it.each([
			["1.234,56", 5],
			["1,234.56", 5],
			["1.234.567,89", 9],
			["1,234,567.89", 9],
			["1.234,5", 5],
			["1,234.5", 5],
			["1.234,567", 5],
			["1.234,5.6", 7],
		])("returns the last separator index for %j", (input, expected) => {
			expect(getDecimalIndex(input)).toBe(expected);
		});
	});

	describe("single separator occurring once", () => {
		it.each([
			["12,5", 2],
			["12.5", 2],
			["12,50", 2],
			["12.50", 2],
			["12,3456", 2],
			["12.3456", 2],
			["12,", 2],
			[",", 0],
			[",5", 0],
			[".50", 0],
		])("treats the separator in %j as decimal", (input, expected) => {
			expect(getDecimalIndex(input)).toBe(expected);
		});
	});

	describe("single separator followed by exactly three digits", () => {
		it.each([["1,234"], ["1.234"], ["12.345"], ["999,999"], ["1234,567"]])(
			"treats the separator in %j as thousands",
			(input) => {
				expect(getDecimalIndex(input)).toBe(-1);
			},
		);

		it.each([
			["0,125", 1],
			["0.125", 1],
			[",125", 0],
			[".125", 0],
		])(
			"treats the separator in %j as decimal because the integer part is zero or empty",
			(input, expected) => {
				expect(getDecimalIndex(input)).toBe(expected);
			},
		);
	});

	describe("single separator occurring multiple times", () => {
		it.each([["1.234.567"], ["1,234,567"], ["12.34.56"], ["1,2,3"]])(
			"treats all separators in %j as thousands",
			(input) => {
				expect(getDecimalIndex(input)).toBe(-1);
			},
		);
	});
});

describe("parsePastedAmount", () => {
	describe("without separators", () => {
		it.each([
			["1", "100"],
			["12", "1200"],
			["100", "10000"],
			["1234", "123400"],
			["0", ""],
			["000", ""],
		])("parses %j as whole euros", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("german format", () => {
		it.each([
			["1,5", "150"],
			["12,5", "1250"],
			["12,50", "1250"],
			["12,05", "1205"],
			["1.234,56", "123456"],
			["1.234,5", "123450"],
			["1.234.567,89", "123456789"],
			["0,99", "99"],
			[",50", "50"],
		])("parses %j", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("english format", () => {
		it.each([
			["1.5", "150"],
			["12.5", "1250"],
			["12.50", "1250"],
			["12.05", "1205"],
			["1,234.56", "123456"],
			["1,234.5", "123450"],
			["1,234,567.89", "123456789"],
			["0.99", "99"],
			[".5", "50"],
		])("parses %j", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("single separator followed by three digits", () => {
		it.each([
			["1,234", "123400"],
			["1.234", "123400"],
			["12.345", "1234500"],
			["12,995", "1299500"],
			["999,999", "99999900"],
			["1234,567", "123456700"],
		])("reads %j as a thousands separator", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});

		it.each([
			["0,125", "13"],
			["0.125", "13"],
			[",125", "13"],
			["0,005", "1"],
			["0,004", ""],
		])("reads %j as a decimal when the integer part is zero or empty", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("repeated single separator", () => {
		it.each([
			["1.234.567", "123456700"],
			["1,234,567", "123456700"],
		])("reads %j as thousands separators only", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("rounding", () => {
		it.each([
			["12,3449", "1234"],
			["12,3450", "1235"],
			["12,3456", "1235"],
			["12.3456", "1235"],
			["0,999", "100"],
			["0,994", "99"],
			["0,995", "100"],
			["12.345,678", "1234568"],
			["1.234,567", "123457"],
			["1.234,564", "123456"],
		])("rounds %j to cents", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("noise", () => {
		it.each([
			["€ 1.234,56", "123456"],
			["1.234,56 €", "123456"],
			["$1,234.56", "123456"],
			["EUR 12,50", "1250"],
			["1 234,56", "123456"],
			["  12,50  ", "1250"],
			["-12,50", "1250"],
			["+12,50", "1250"],
			["(12,50)", "1250"],
			["12,50\n", "1250"],
			["\t12,50\t", "1250"],
		])("ignores non numeric characters in %j", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("zero", () => {
		it.each([
			["0", ""],
			["0,00", ""],
			["0.00", ""],
			["0,001", ""],
			["000,00", ""],
		])("normalizes %j to an empty value", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("large values", () => {
		it.each([
			["999999999,99", "99999999999"],
			["999.999.999,99", "99999999999"],
			["999,999,999.99", "99999999999"],
		])("parses %j without losing precision", (input, expected) => {
			expect(parsePastedAmount(input)).toBe(expected);
		});
	});

	describe("invalid input", () => {
		it.each([[""], ["abc"], ["€"], [","], ["."], [",."], ["   "], ["-"]])(
			"returns null for %j",
			(input) => {
				expect(parsePastedAmount(input)).toBeNull();
			},
		);
	});
});

describe("parsePastedAmount combined with formatInput", () => {
	it.each([
		["12", "12,00"],
		["12,5", "12,50"],
		["12.5", "12,50"],
		["1.234,56", "1.234,56"],
		["1,234.56", "1.234,56"],
		["1,234", "1.234,00"],
		["0,125", "0,13"],
		["0,999", "1,00"],
		[",50", "0,50"],
		["0", "0,00"],
		["€ 1.234.567,89", "1.234.567,89"],
	])("displays pasted %j as %j", (input, expected) => {
		const parsed = parsePastedAmount(input);

		expect(parsed).not.toBeNull();
		expect(formatInput(parsed ?? "")).toBe(expected);
	});

	it.each(["1", "12", "123", "1234", "123456", "1234567", "123456789"])(
		"round trips the displayed value of %j",
		(digits) => {
			expect(parsePastedAmount(formatInput(digits))).toBe(digits);
		},
	);
});
