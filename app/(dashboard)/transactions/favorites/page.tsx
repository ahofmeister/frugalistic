import React, { Suspense } from "react";
import { dbTransaction } from "@/db";
import { favoriteSchema } from "@/db/migrations/schema";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { FavoritesListView } from "@/app/(dashboard)/transactions/favorites/favorite-card";

async function FavoritesList() {
  const fetchedFavorites = await dbTransaction(async (tx) => {
    return tx.select().from(favoriteSchema);
  });

  const settings = await getSettings();
  console.log(fetchedFavorites);

  return (
    <FavoritesListView
      favorites={fetchedFavorites}
      dateFormat={settings.date_format}
    />
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
