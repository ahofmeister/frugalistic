import { eq } from "drizzle-orm";
import Link from "next/link";
import { getActiveAccountId } from "@/features/account/account-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/features/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { categories } from "@/drizzle/schema/categories";

export const NumberCategories = async () => {
	const activeAccountId = await getActiveAccountId();

	const count = await dbTransaction((tx) =>
		tx.$count(categories, eq(categories.accountId, activeAccountId)),
	);

	return (
		<Link href="/categories">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="text-xl">Categories</div>
					</CardTitle>
				</CardHeader>
				<CardFooter>{count}</CardFooter>
			</Card>
		</Link>
	);
};
