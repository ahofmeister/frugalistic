"use client";
import React, { useState } from "react";

import LoadingSpinner from "@/components/loading/loading";
import { deleteTransaction } from "@/components/transactions/transactions-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DeleteTransaction = (props: { id: string }) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);

    function showErrorToast() {
      toast({
        title: "Error",
        description:
          "Failed to delete the transaction. Please try again later.",
        variant: "destructive",
      });
    }

    try {
      const { error } = await deleteTransaction(props.id);
      if (error) {
        showErrorToast();
      } else {
        toast({
          title: "Transaction Deleted",
          description: "The transaction has been successfully removed.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showErrorToast();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      className="w-full"
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? <LoadingSpinner /> : "Delete Transaction"}
    </Button>
  );
};

export default DeleteTransaction;
