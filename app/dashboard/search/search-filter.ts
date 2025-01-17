import { SortDirection } from "@/app/dashboard/search/search-sort-direction";
import { Transaction, TransactionType } from "@/types";

export type SearchFilter = {
  dateFrom: string | undefined;
  amountMin: string | undefined;
  amountMax: string | undefined;
  dateTo: string | undefined;
  description: string | undefined;
  category: string | undefined;
  type: TransactionType;
  sortBy: keyof Transaction | undefined;
  sortDirection: SortDirection;
};

export function isFilterEmpty(filter: SearchFilter): boolean {
  return Object.keys(filter).every((key) => {
    const value = filter[key as keyof SearchFilter];
    return (
      value === undefined ||
      value.trim() === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && true && Object.keys(value).length === 0)
    );
  });
}
