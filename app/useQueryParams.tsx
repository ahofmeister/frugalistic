import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useQueryParams = (
  paramKey: string,
): {
  setQueryParam: (value: string) => void;
  reset: () => void;
  queryParam: string;
} => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [paramValue, setParamValue] = useState<string>("");

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    const currentValue = currentParams.get(paramKey) || "";
    setParamValue(currentValue);
  }, [paramKey, searchParams]);

  const updateQueryParam = (value: string) => {
    const queryParams = new URLSearchParams(searchParams);
    if (!value) {
      queryParams.delete(paramKey);
    } else {
      queryParams.set(paramKey, value);
    }
    const queryString = queryParams.toString();
    router.push(`${path}?${queryString}`);
  };

  const reset = () => {
    router.push(path);
    setParamValue("");
  };

  return { queryParam: paramValue, setQueryParam: updateQueryParam, reset };
};

export default useQueryParams;
