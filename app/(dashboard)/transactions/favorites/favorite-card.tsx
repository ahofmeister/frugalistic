import React from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import TransactionAmount from "@/components/transactions/components/transaction-amount";
import { formatDate } from "date-fns";
import { favoriteSchema } from "@/db/migrations/schema";
import { FavoriteQuickAddDialog } from "@/app/(dashboard)/transactions/favorites/favorite-quick-add-dialog";
import { DeleteFavoriteTransactionButton } from "@/app/(dashboard)/transactions/favorites/delete-favorite-transaction-button";

export function FavoriteCard({
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
          <DeleteFavoriteTransactionButton favoriteId={favorite.id} />
        </div>
      </div>
    </Card>
  );
}
