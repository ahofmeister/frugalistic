import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export const NumberCategories = async () => {
	const supabase = await createClient();

	const { count } = await supabase
		.from("categories")
		.select("id", { count: "exact", head: true });

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="text-xl">Categories</div>
				</CardTitle>
			</CardHeader>
			<CardFooter>{count}</CardFooter>
		</Card>
	);
};
