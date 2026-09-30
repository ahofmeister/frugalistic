import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { dbTransaction } from "@/drizzle/client";
import { categories } from "@/drizzle/schema";
import { Alert, AlertDescription, AlertTitle } from "@/features/ui/alert";

export async function CategoriesBanner() {
	const count = await dbTransaction((tx) => tx.$count(categories));

	if (count > 0) {
		return null;
	}

	return (
		<Alert className="w-fit">
			<TriangleAlert className="size-5" />
			<AlertTitle>Heads up!</AlertTitle>
			<AlertDescription>
				You do not have any category yet. Click
				<Link className="underline" href="/categories">
					{" "}
					here{" "}
				</Link>
				to create them.
			</AlertDescription>
		</Alert>
	);
}
