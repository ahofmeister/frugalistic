export const getThemeColor = (colorName: string) => {
	return getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorName}`).trim();
};

export const transactionColors: { [index: string]: string } = {
	income: getThemeColor("income"),
	savings: getThemeColor("savings"),
	expense: getThemeColor("expense"),
};

export const transactionWithLeftover: { [index: string]: string } = {
	...transactionColors,
	leftover: getThemeColor("leftover"),
};
