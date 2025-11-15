import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  isFilterEmpty,
  SearchFilter,
} from "@/app/dashboard/search/search-filter";

const ResetQueryParam = async ({
  searchParams,
}: {
  searchParams: Promise<SearchFilter>;
}) => {
  const params = await searchParams;
  return (
    <Link href={"/dashboard/search"}>
      <Button disabled={isFilterEmpty(params)} variant="secondary">
        Reset Filter
      </Button>
    </Link>
  );
};
export default ResetQueryParam;
