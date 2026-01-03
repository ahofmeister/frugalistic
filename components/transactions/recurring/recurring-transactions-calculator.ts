import { addMonths, addYears } from "date-fns";

export const calculateNextRun = (
  date: string,
  recurringInterval: "monthly" | "annually",
): Date => {
  const currentRun = new Date(date);

  switch (recurringInterval) {
    case "monthly":
      return addMonths(currentRun, 1);
    case "annually":
      return addYears(currentRun, 1);
  }
};
