// src/app/api/auth/callback/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 세션 교환 성공 시 사용자 정보를 가져와 닉네임을 설정합니다.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (!userError && userData?.nickname) {
          // 닉네임을 사용자 메타데이터에 저장합니다.
          await supabase.auth.updateUser({
            data: { nickname: userData.nickname },
          });
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
