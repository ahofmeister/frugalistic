"use client";

import React from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { formatDate } from "date-fns";
import { favoriteSchema } from "@/db/migrations/schema";
import { FavoriteQuickAddDialog } from "@/app/(dashboard)/transactions/favorites/favorite-quick-add-dialog";

function FavoriteCard({
  favorite,
  dateFormat,
}: {
  favorite: typeof favoriteSchema.$inferSelect;
  dateFormat: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <FavoriteQuickAddDialog favorite={favorite} />

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium truncate">{favorite.description}</h3>
              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 fill-yellow-500" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {favorite.createdAt && (
                  <div>
                    Created: {formatDate(favorite.createdAt, dateFormat)}
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <TransactionAmount amount={favorite.amount} type={favorite.type} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function FavoritesListView({
  favorites,
  dateFormat,
}: {
  favorites: (typeof favoriteSchema.$inferSelect)[];
  dateFormat: string;
}) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-lg">No favorite transactions</h3>
        <p className="text-sm text-muted-foreground">
          Mark transactions as favorites for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Favorite Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Quick add or view your most used transactions
        </p>
      </div>
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          dateFormat={dateFormat}
        />
      ))}
    </div>
  );
}
