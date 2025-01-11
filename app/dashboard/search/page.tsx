import React, { Suspense } from "react";

import AmountSearchFilter from "@/app/dashboard/search/amount-search-filter";
import DateSearchFilter from "@/app/dashboard/search/date-search-filter";
import ResetQueryParam from "@/app/dashboard/transactions/reset-query-param";
import CategorySearchFilter from "@/components/transactions/components/category-search-filter";
import TransactionSearchInput from "@/components/transactions/components/transaction-search-input";
import TransactionsSearchResult from "@/components/transactions/components/transactions-search-result";
import TypeSearchFilter from "@/components/transactions/components/type-search-filter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionType } from "@/types";

export default async function TransactionSearchPage(props: {
  searchParams: Promise<{
    dateFrom: string;
    dateTo: string;
    amountFrom: string;
    amountTo: string;
    description: string;
    category: string;
    type: TransactionType;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col ml-2 mt-2 gap-4">
      <TransactionSearchInput value={searchParams.description} />

      <div className="flex gap-x-4">
        <CategorySearchFilter
          key={searchParams.category}
          value={searchParams.category}
        />

        <TypeSearchFilter key={searchParams.type} value={searchParams.type} />
      </div>

      <div className="flex gap-x-4">
        <DateSearchFilter
          key={searchParams.dateFrom}
          paramName="dateFrom"
          label="Date from"
          value={searchParams.dateFrom}
        />
        <DateSearchFilter
          key={searchParams.dateTo}
          paramName="dateTo"
          label="Date to"
          value={searchParams.dateTo}
        />
      </div>

      <div className="flex gap-x-4">
        <AmountSearchFilter
          paramName="amountFrom"
          placeholder="Amount from"
          value={searchParams.amountFrom}
        />
        <AmountSearchFilter
          paramName="amountTo"
          placeholder="Amount to"
          value={searchParams.amountTo}
        />
      </div>

      <ResetQueryParam />

      <div className="mt-4">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 25 }).map((_, i) => (
                <Card key={i} className="mb-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <Skeleton className="w-20 h-4"></Skeleton>
                      <Skeleton className="w-20 h-4"></Skeleton>
                    </CardTitle>
                    <Skeleton className="w-20 h-4"></Skeleton>
                    <Skeleton className="w-24 h-4"></Skeleton>
                  </CardHeader>
                </Card>
              ))}
            </>
          }
        >
          <TransactionsSearchResult
            category={searchParams.category}
            description={searchParams.description}
            dateFrom={searchParams.dateFrom}
            dateTo={searchParams.dateTo}
            amountFrom={searchParams.amountFrom}
            amountTo={searchParams.amountTo}
            type={searchParams.type}
          />
        </Suspense>
      </div>
    </div>
  );
}
