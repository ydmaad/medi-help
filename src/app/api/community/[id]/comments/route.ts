import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

// 댓글 불러오는 요청
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("comments")
      .select(`id, comment, created_at,post_id,user:user_id(nickname, avatar) `)
      .eq("post_id", id);
    // console.log("된다!!", data);

    if (error) {
      return NextResponse.json(
        { error: "댓글 데이터 조회 실패", message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "댓글 조회 성공", data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
