import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { TransactionType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dbTransaction } from "@/db";
import { categories, transactionSchema } from "@/db/migrations/schema";

interface PivotData {
  [key: string]: {
    name: string;
    color: string;
    years: { [key: number]: number };
  };
}

interface CategoryRow {
  id: string;
  name: string;
  color: string;
  amounts: number[];
  type: TransactionType;
}

interface TotalsRow {
  label: string;
  amounts: number[];
  type: TransactionType;
  percentages?: number[];
}

async function getCategoryYearTable(): Promise<{
  years: number[];
  categories: CategoryRow[];
  totals: TotalsRow[];
}> {
  const transactionsFetched = await dbTransaction((tx) =>
    tx.select().from(transactionSchema),
  );

  const fetchedCategories = await dbTransaction((tx) =>
    tx.select().from(categories),
  );

  const pivot: PivotData = {};
  const years: Set<number> = new Set();
  const totals: { [key: string]: { [key: number]: number } } = {
    income: {},
    savings: {},
  };

  fetchedCategories?.forEach((cat) => {
    pivot[cat.id] = {
      name: cat.name,
      color: cat.color,
      years: {},
    };
  });

  transactionsFetched?.forEach((tx) => {
    if (!tx.datetime) {
      return;
    }

    const year = new Date(tx.datetime).getFullYear();
    years.add(year);

    if (tx.type === "income" || tx.type === "savings") {
      totals[tx.type][year] = (totals[tx.type][year] || 0) + tx.amount;
    }

    if (tx.type === "expense" && tx.category) {
      if (!pivot[tx.category]) {
        pivot[tx.category] = { name: "", color: "", years: {} };
      }
      pivot[tx.category].years[year] =
        (pivot[tx.category].years[year] || 0) + tx.amount;
    }
  });

  const sortedYears = Array.from(years).sort((a, b) => b - a);

  const expenseTotals: { [key: number]: number } = {};
  Object.values(pivot).forEach((cat) => {
    Object.entries(cat.years).forEach(([year, amount]) => {
      const y = Number(year);
      expenseTotals[y] = (expenseTotals[y] || 0) + amount;
    });
  });

  const incomeAmounts = sortedYears.map((y) => totals.income[y] || 0);
  const savingsAmounts = sortedYears.map((y) => totals.savings[y] || 0);

  const savingsPercentages = savingsAmounts.map((s, idx) =>
    incomeAmounts[idx] > 0 ? (s / incomeAmounts[idx]) * 100 : 0,
  );

  const totalsRows: TotalsRow[] = [
    {
      label: "Income",
      amounts: incomeAmounts,
      type: "income",
    },
    {
      label: "Savings",
      amounts: savingsAmounts,
      type: "savings",
      percentages: savingsPercentages,
    },
    {
      label: "Total Expense",
      amounts: sortedYears.map((y) => expenseTotals[y] || 0),
      type: "expense",
    },
  ];

  const categoryRows: CategoryRow[] = Object.entries(pivot)
    .filter(([_, cat]) => Object.keys(cat.years).length > 0)
    .map(([id, cat]) => ({
      id,
      name: cat.name,
      color: cat.color,
      amounts: sortedYears.map((y) => cat.years[y] || 0),
      type: "expense" as TransactionType,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { years: sortedYears, categories: categoryRows, totals: totalsRows };
}

export default async function YearComparison() {
  const { years, categories, totals } = await getCategoryYearTable();

  return (
    <div className="w-full p-4 overflow-x-auto">
      <Table className="w-full border-collapse border border-border">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-border p-3 text-left">
              Category
            </TableHead>
            {years.map((year) => (
              <TableHead
                key={year}
                className="border border-border p-3 text-center"
              >
                {year}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {totals.map((total) => (
            <TableRow key={total.label} className="bg-card font-semibold">
              <TableCell className="border border-border p-3">
                {total.label}
              </TableCell>
              {total.amounts.map((amount, idx) => (
                <TableCell
                  key={idx}
                  className="border border-border p-3 text-right"
                >
                  <div className="flex flex-col items-end gap-1">
                    <TransactionAmount amount={amount} type={total.type} />
                    {total.type === "savings" && total.percentages && (
                      <span className="text-xs text-muted-foreground">
                        {total.percentages[idx].toFixed(1)}% of income
                      </span>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className="bg-border">
            <TableCell colSpan={years.length + 1}></TableCell>
          </TableRow>
          {categories.map((cat) => (
            <TableRow key={cat.id} className="hover:bg-card">
              <TableCell className="border border-border p-3 font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </div>
              </TableCell>
              {cat.amounts.map((amount, idx) => (
                <TableCell
                  key={idx}
                  className="border border-border p-3 text-right"
                >
                  <TransactionAmount amount={amount} type="expense" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
