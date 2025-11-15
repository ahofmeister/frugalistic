import { CategoryFormWithData } from "@/app/dashboard/categories/edit/[id]/category-form-with-data";
import { Suspense } from "react";

export default async function CategoryEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <CategoryFormWithData categoryId={props.params.then((p) => p.id)} />
    </Suspense>
  );
}
