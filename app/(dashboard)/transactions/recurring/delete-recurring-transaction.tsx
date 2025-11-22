"use client";
import { useRouter } from "next/navigation";
import React, { use } from "react";

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

const DeleteRecurringTransaction = (props: { id: Promise<string> }) => {
  const router = useRouter();

  const id = use(props.id);

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
            const error = await deleteRecurringTransaction(id);

            if (!error) {
              router.push("/transactions/recurring");
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
