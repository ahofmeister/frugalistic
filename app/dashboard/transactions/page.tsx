import React, { Suspense } from "react";

import ResetQueryParam from "@/app/dashboard/transactions/reset-query-param";
import TransactionSearchInput from "@/components/transactions/components/transaction-search-input";
import TransactionsResult from "@/components/transactions/components/transactions-search-result";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import CategorySearchFilter from "@/components/transactions/components/category-search-filter";
import DateSearchFilter from "@/components/transactions/components/date-search-filter";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: {
    dateFrom: string;
    dateTo: string;
    description: string;
    category: string;
  };
}) {
  const { data: categories } = await createClient()
    .from("categories")
    .select("*");

  return (
    <>
      <div className="flex gap-10 mt-2 ml-1">
        <TransactionSearchInput
          key={searchParams.description}
          value={searchParams.description}
        />
        <DateSearchFilter
          key={searchParams.dateFrom}
          paramName={"dateFrom"}
          label={"Filter from"}
          value={searchParams.dateFrom}
        />
        <DateSearchFilter
          key={searchParams.dateTo}
          paramName={"dateTo"}
          label={"Filter to"}
          value={searchParams.dateTo}
        />
        <CategorySearchFilter
          key={searchParams.category}
          categories={categories ?? []}
          value={searchParams.category}
        />
        <ResetQueryParam />
      </div>

      <div className="mt-4">
        <Suspense
          fallback={
            <div className="w-full p-4 space-y-4 bg-gray-950 text-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px] bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px] bg-gray-700" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 bg-gray-700" />
                          <Skeleton className="h-4 w-[80px] bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px] bg-gray-700" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[60px] ml-auto bg-gray-700" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
                          <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
                          <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }
        >
          <TransactionsResult
            category={searchParams.category}
            description={searchParams.description}
            dateFrom={searchParams.dateFrom}
            dateTo={searchParams.dateTo}
          />
        </Suspense>
      </div>
    </>
  );
}
