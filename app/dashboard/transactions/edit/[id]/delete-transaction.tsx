"use client";
import React from "react";

import { deleteTransaction } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";

const DeleteTransaction = (props: { id: string }) => {
  return (
    <Button
      className="w-full"
      variant="destructive"
      onClick={() => deleteTransaction(props.id)}
    >
      Delete Transaction
    </Button>
  );
};

export default DeleteTransaction;
