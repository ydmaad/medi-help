// src/app/api/auth/callback/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("Callback route hit, code:", code);

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("Exchange code for session result:", { data, error });

    if (!error && data.user) {
      // 카카오 계정의 닉네임 또는 이메일을 사용자 이름으로 사용
      const username =
        data.user.user_metadata.full_name ||
        data.user.email?.split("@")[0] ||
        "User";

      // users 테이블에 사용자 정보 저장 또는 업데이트
      const { data: userData, error: upsertError } = await supabase
        .from("users")
        .upsert(
          {
            id: data.user.id,
            email: data.user.email,
            nickname: username,
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      console.log("Upsert user data result:", { userData, upsertError });

      if (upsertError) {
        console.error("Error upserting user data:", upsertError);
      } else {
        console.log("User data saved/updated:", userData);
      }
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Error during auth callback:", error.message);
    }
  } else {
    console.error("Error during auth callback: No code provided");
  }

  // 에러가 있거나 코드가 없는 경우
  console.log("Redirecting to error page");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
