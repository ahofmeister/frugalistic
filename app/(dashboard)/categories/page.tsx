import Link from "next/link";
import { Suspense } from "react";

import CategoryList from "@/app/(dashboard)/categories/category-list";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
	return (
		<div className="space-y-6 ">
			<div className="flex justify-between items-center">
				<div className="text-2xl font-semibold">Categories</div>
				<Link href="/categories/new">
					<Button>Create</Button>
				</Link>
			</div>

			<Suspense>
				<CategoryList />
			</Suspense>
		</div>
	);
}
