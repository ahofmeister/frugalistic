import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { CacheTag } from "@/app/caching";
import { Database } from "@/types/supabase";

export const createClient = async (
  tag?: CacheTag,
  caching: boolean = false,
) => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error(error);
          }
        },
      },
      global: {
        fetch: createFetch({
          cache: caching ? "force-cache" : "no-cache",
          next: caching
            ? {
                revalidate: false,
                tags: tag ? [tag] : undefined,
              }
            : undefined,
        }),
      },
    },
  );
};

export const createFetch =
  (options: Pick<RequestInit, "next" | "cache"> | undefined) =>
  (url: RequestInfo | URL, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      ...options,
    });
  };
