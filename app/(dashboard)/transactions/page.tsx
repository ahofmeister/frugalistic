import React, { Suspense } from "react";
import { SearchFilter } from "@/app/(dashboard)/transactions/search-filter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionsSearchResult from "@/components/transactions/components/transactions-search-result";
import TransactionSearchInput from "@/components/transactions/components/transaction-search-input";
import CategorySearchFilter from "@/components/transactions/components/category-search-filter";
import TransactionTypeSearchFilter from "@/app/(dashboard)/transactions/transaction-type-search-filter";
import DateSearchFilter from "@/app/(dashboard)/transactions/date-search-filter";
import AmountSearchFilter from "@/app/(dashboard)/transactions/amount-search-filter";
import ResetQueryParam from "@/app/(dashboard)/transactions/reset-query-param";
import SearchSortBy from "@/app/(dashboard)/transactions/search-sort-by";
import SearchSortDirection from "@/app/(dashboard)/transactions/search-sort-direction";

export default async function TransactionSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchFilter>;
}) {
  return (
    <div className="flex flex-col ml-2 mt-2 gap-4">
      <Suspense>
        <TransactionSearchInput />
      </Suspense>
      <div className="flex gap-x-4">
        <Suspense>
          <CategorySearchFilter />
        </Suspense>

        <Suspense>
          <TransactionTypeSearchFilter />
        </Suspense>
      </div>
      <div className="flex gap-x-4">
        <Suspense>
          <DateSearchFilter paramName="dateFrom" label="Date from" />
          <DateSearchFilter paramName="dateTo" label="Date to" />
        </Suspense>
      </div>
      Amount Range
      <div className="flex gap-x-4">
        <Suspense>
          <AmountSearchFilter paramName="amountMin" placeholder="Amount from" />
          <AmountSearchFilter paramName="amountMax" placeholder="Amount to" />
        </Suspense>
      </div>
      <Suspense>
        <ResetQueryParam searchParams={searchParams} />
      </Suspense>
      <div className="flex gap-x-4 justify-start">
        <div className="w-36">
          <Suspense>
            <SearchSortBy />
          </Suspense>
        </div>
        <Suspense>
          <SearchSortDirection />
        </Suspense>
      </div>
      <div className="mt-4">
        <Suspense
          fallback={
            <>
              <div>
                <Skeleton className={"w-32 h-6 mb-2"}></Skeleton>
              </div>
              {Array.from({ length: 100 }).map((_, i) => (
                <Card key={i} className="mb-2 h-20">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <Skeleton className="w-20 h-4"></Skeleton>
                      <Skeleton className="w-14 h-4"></Skeleton>
                    </CardTitle>
                    <div className={"flex justify-between"}>
                      <Skeleton className="w-20 h-4"></Skeleton>
                      <Skeleton className="w-24 h-4"></Skeleton>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </>
          }
        >
          <TransactionsSearchResult filter={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
