"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { removeFavorite } from "@/components/favorite/favorite-actions";
import { toast } from "sonner";

export function DeleteFavoriteTransactionButton({
  favoriteId,
}: {
  favoriteId: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={async () => {
        try {
          await removeFavorite(favoriteId);
          toast.success("Favorite transaction removed.");
        } catch (error) {
          toast.error("Failed to remove favorite transaction.");
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
