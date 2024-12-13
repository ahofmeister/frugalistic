"use client";
import { useRouter } from "next/navigation";
import React from "react";

import { deleteRecurringTransaction } from "@/components/transactions/transactions-api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RecurringTransaction } from "@/types";

const DeleteRecurringTransaction = (props: {
  recurringTransaction: RecurringTransaction;
}) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>Cannot be undone</AlertDialogDescription>
        <AlertDialogAction
          className="bg-destructive"
          onClick={async () => {
            const error = await deleteRecurringTransaction(
              props.recurringTransaction.id,
            );

            if (!error) {
              router.push("/dashboard/recurring");
            }
          }}
        >
          Delete
        </AlertDialogAction>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecurringTransaction;
