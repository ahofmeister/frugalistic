import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { CacheTag } from "@/app/caching";
import { Database } from "@/types/supabase";

type Cookie = {
  name: string;
  value: string;
  options?: {
    [key: string]: string;
  };
};

export const createClient = (tag?: CacheTag, caching: boolean = true) => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): { name: string; value: string }[] {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Cookie[]): void {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        fetch: createFetch({
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
