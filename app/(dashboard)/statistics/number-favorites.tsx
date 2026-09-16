import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { favoriteSchema } from "@/drizzle/schema";

export const NumberFavorites = async () => {
	const count = await dbTransaction((tx) => {
		return tx.$count(favoriteSchema);
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Favorites</div>
				</CardTitle>
			</CardHeader>
			<CardFooter>{count}</CardFooter>
		</Card>
	);
};
