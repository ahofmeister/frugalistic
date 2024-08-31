"use client";
import React from "react";

import { invokeRecurringTransactions } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";

const InvokeRecurringTransactions = () => {
  return (
    <Button onClick={() => invokeRecurringTransactions()}>
      Invoke recurring transactions
    </Button>
  );
};

export default InvokeRecurringTransactions;
