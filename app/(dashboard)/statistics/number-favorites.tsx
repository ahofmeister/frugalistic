import { eq } from "drizzle-orm";
import { getActiveAccountId } from "@/components/account/account-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { favoriteSchema } from "@/drizzle/schema";

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
