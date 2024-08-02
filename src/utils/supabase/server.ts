import { createBrowserClient, type CookieOptions } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === "undefined") return null;
          const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split("=")[1] : null;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (typeof document === "undefined") return;
          let cookieString = `${name}=${value}`;
          if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
          }
          if (options.path) {
            cookieString += `; path=${options.path}`;
          }
          if (options.domain) {
            cookieString += `; domain=${options.domain}`;
          }
          if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
          }
          if (options.secure) {
            cookieString += "; secure";
          }
          document.cookie = cookieString;
        },
        remove(name: string, options: CookieOptions) {
          if (typeof document === "undefined") return;
          this.set(name, "", { ...options, expires: new Date(0) });
        },
      },
    }
  );
}

// 기존 로직(추후 상황에 따라 반영예정)
// import { createServerClient, type CookieOptions } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export function createClient() {
//   const cookieStore = cookies();

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             );
//           } catch {
//             // The `setAll` method was called from a Server Component.
//             // This can be ignored if you have middleware refreshing
//             // user sessions.
//           }
//         },
//       },
//     }
//   );
// }
