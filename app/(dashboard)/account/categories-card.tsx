import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

const CategoriesCard = async () => {
	const supabase = await createClient();
	const { data, count } = await supabase
		.from("categories")
		.select("*", { count: "exact" })
		.order("name");
	return (
		<Link href="/categories">
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between">
						<div>Categories</div>
						<div>{count}</div>
					</CardTitle>
					<CardDescription>
						{data
							?.slice(0, 3)
							.map((category) => {
								return category.name;
							})
							.join(", ")}
						, ...
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};

export default CategoriesCard;
