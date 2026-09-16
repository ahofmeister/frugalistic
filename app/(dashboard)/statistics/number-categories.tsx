import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dbTransaction } from "@/drizzle/client";
import { categories } from "@/drizzle/schema/categories";

export const NumberCategories = async () => {
	const count = await dbTransaction((tx) => tx.$count(categories));

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
