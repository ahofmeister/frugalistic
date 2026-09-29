import { Star } from "lucide-react";
import { Suspense } from "react";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { FavoriteCard } from "@/app/(dashboard)/transactions/favorites/favorite-card";
import { getActiveAccountId } from "@/features/account/account-actions";
import { dbTransaction } from "@/drizzle/client";

async function FavoritesList() {
	const activeAccountId = await getActiveAccountId();
	const fetchedFavorites = await dbTransaction(async (tx) => {
		return tx.query.favoriteSchema.findMany({
			where: {
				accountId: activeAccountId,
			},
		});
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
				<FavoriteCard key={favorite.id} favorite={favorite} dateFormat={settings.dateFormat} />
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
