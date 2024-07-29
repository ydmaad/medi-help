import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("magazine").select("*");

    if (error) {
      return NextResponse.json(
        { error: "데이터 조회 실패", message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "조회 성공", data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
