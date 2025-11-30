import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/db";
import { favoriteSchema } from "@/db/migrations/schema";
import { count } from "drizzle-orm";

export const NumberFavorites = async () => {
  const [{ count: favoritesCount }] = await dbTransaction((tx) => {
    return tx.select({ count: count() }).from(favoriteSchema);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-xl">Favorites</div>
        </CardTitle>
      </CardHeader>
      <CardFooter>{favoritesCount}</CardFooter>
    </Card>
  );
};
