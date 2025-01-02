import CategoryForm from "@/components/categories/category-form";
import { createClient } from "@/utils/supabase/server";

export default async function CategoryEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: transaction } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  return <CategoryForm category={transaction ?? undefined} />;
}
