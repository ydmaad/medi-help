import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
  const { email, password, nickname } = await request.json();

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password }
    );

    if (signUpError) {
      throw signUpError;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: signUpData.user?.id,
        email,
        nickname,
        avatar: "",
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: "회원가입이 완료되었습니다." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
