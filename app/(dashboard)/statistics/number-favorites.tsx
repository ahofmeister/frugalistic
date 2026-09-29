import { eq } from "drizzle-orm";
import { dbTransaction } from "@/drizzle/client";
import { favoriteSchema } from "@/drizzle/schema";
import { getActiveAccountId } from "@/features/account/account-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";

export const NumberFavorites = async () => {
	const activeAccountId = await getActiveAccountId();

	const count = await dbTransaction((tx) =>
		tx.$count(favoriteSchema, eq(favoriteSchema.accountId, activeAccountId)),
	);

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
