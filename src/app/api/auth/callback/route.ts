// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) throw error;

      if (data.user) {
        // 사용자 정보를 데이터베이스에 저장 또는 업데이트
        const { data: userData, error: upsertError } = await supabase
          .from("users")
          .upsert(
            {
              id: data.user.id,
              email: data.user.email,
              nickname:
                data.user.user_metadata.full_name ||
                data.user.email?.split("@")[0] ||
                "User",
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        if (upsertError) {
          console.error("Error upserting user data:", upsertError);
        } else {
          console.log("User data saved/updated:", userData);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error("Error in auth callback:", error);
    }
  }

  // 에러가 발생했거나 코드가 없는 경우
  console.error("Auth callback error or no code provided");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
