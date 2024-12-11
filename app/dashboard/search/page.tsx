import React, { Suspense } from "react";

import ResetQueryParam from "@/app/dashboard/transactions/reset-query-param";
import CategorySearchFilter from "@/components/transactions/components/category-search-filter";
import DateSearchFilter from "@/components/transactions/components/date-search-filter";
import TransactionSearchInput from "@/components/transactions/components/transaction-search-input";
import TransactionsSearchResult from "@/components/transactions/components/transactions-search-result";
import TypeSearchFilter from "@/components/transactions/components/type-search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TransactionType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function TransactionsPage(props: {
  searchParams: Promise<{
    dateFrom: string;
    dateTo: string;
    description: string;
    category: string;
    type: TransactionType;
  }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="ml-2 mt-2">
      <div className="flex gap-10">
        <TransactionSearchInput value={searchParams.description} />
        <DateSearchFilter
          key={searchParams.dateFrom}
          paramName="dateFrom"
          label="Filter from"
          value={searchParams.dateFrom}
        />
        <DateSearchFilter
          key={searchParams.dateTo}
          paramName="dateTo"
          label="Filter to"
          value={searchParams.dateTo}
        />
      </div>
      <div className="flex gap-10 mt-4">
        <CategorySearchFilter
          key={searchParams.category}
          categories={categories ?? []}
          value={searchParams.category}
        />

        <TypeSearchFilter key={searchParams.type} value={searchParams.type} />

        <ResetQueryParam />
      </div>

      <div className="mt-4">
        <Suspense
          fallback={
            <div className="w-full p-4 space-y-4 text-gray-200">
              <Table>
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
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[60px] ml-auto bg-gray-700" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }
        >
          <TransactionsSearchResult
            category={searchParams.category}
            description={searchParams.description}
            dateFrom={searchParams.dateFrom}
            dateTo={searchParams.dateTo}
            type={searchParams.type}
          />
        </Suspense>
      </div>
    </div>
  );
}
