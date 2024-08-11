import { supabase } from "./../../../../../utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

// 게시글 별 북마크 데이터 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // console.log("파람스!!: ", params);
  const postId = params.id;
  // console.log("게시글 아이디!! :", postId);

  if (!postId) {
    return NextResponse.json({ error: "게시글 id 오류" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("bookmark")
      .select("*")
      .eq("post_id", postId);

    if (error) throw error;
    // console.log("이게 내가 가져온 데이터!! : ", data);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("북마크 GET 오류 :", error);
    return NextResponse.json({ error: "북마크 GET 실패" }, { status: 500 });
  }
}

// 게시글 북마크 토글 요청
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = params.id;
  const userId = request.headers.get("User-Id");
  if (!userId) {
    return NextResponse.json({ error: "인증되지 않은 사용자입니다." });
  }

  // console.log("현재 게시글 아이디!!", postId);
  // console.log("현재 유저 아이디!!", userId);

  try {
    // 기존 북마크 확인
    const { data: existingBookmark, error: fetchError } = await supabase
      .from("bookmark")
      .select()
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    // PGRST116 : '결과가 없음' -> 정상적인 흐름으로 처리
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingBookmark) {
      // 북마크 제거
      const { error: deleteError } = await supabase
        .from("bookmark")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      return NextResponse.json({ message: "북마크가 제거되었습니다." });
    } else {
      // 북마크 추가
      const { error: insertError } = await supabase
        .from("bookmark")
        .insert({ post_id: postId, user_id: userId });

      if (insertError) throw insertError;

      return NextResponse.json({ message: "북마크가 추가되었습니다." });
    }
  } catch (error) {
    console.error("북마크 토글 중 오류 발생:", error);
    return NextResponse.json({ error: "북마크 토글 실패" }, { status: 500 });
  }
}
