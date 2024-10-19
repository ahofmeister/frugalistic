import { useRouter, useSearchParams } from "next/navigation";

const useUpdateQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (key: string, value: string | null) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (value) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }

    router.replace(`?${currentParams.toString()}`);
  };
};

export default useUpdateQueryParams;
