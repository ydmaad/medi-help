import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password }
    );
    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 });
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: signUpData.user?.id,
        email,
        avatar: "",
      },
    ]);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "회원가입이 완료되었습니다." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
