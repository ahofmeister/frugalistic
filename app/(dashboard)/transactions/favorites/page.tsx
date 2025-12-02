import React, { Suspense } from "react";
import { dbTransaction } from "@/db";
import { favoriteSchema } from "@/db/migrations/schema";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Star } from "lucide-react";
import { FavoriteCard } from "@/app/(dashboard)/transactions/favorites/favorite-card";

async function FavoritesList() {
  const fetchedFavorites = await dbTransaction(async (tx) => {
    return tx.select().from(favoriteSchema);
  });

  const settings = await getSettings();

  if (fetchedFavorites.length === 0) {
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
      {fetchedFavorites.map((favorite) => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          dateFormat={settings.date_format}
        />
      ))}
    </div>
  );
}

const FavoritesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesList />
    </Suspense>
  );
};

export default FavoritesPage;
