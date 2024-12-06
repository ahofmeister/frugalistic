export const transactionColors: { [index: string]: string } = {
  income: "#84F5F5",
  savings: "#e9c46a",
  expense: "#F58484",
};

export const transactionWithLeftover: { [index: string]: string } = {
  ...transactionColors,
  leftover: "#FFFFFF",
};
