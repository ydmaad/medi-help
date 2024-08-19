import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

// 검색 게시글 불러오는 요청
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "6");
    // 페이지 시작 인덱스
    const offset = (page - 1) * perPage;
    const sortOption = searchParams.get("sort") || "최신순";
    const searchTerm = searchParams.get("term") || "";

    console.log("검색어:", searchTerm);

    if (searchTerm.trim() === "") {
      console.log("검색어가 비어 있음");
      return NextResponse.json({ searchPosts: [] });
    }

    console.log("Supabase 쿼리 시작");
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        title,
        contents,
        img_url,
        created_at,
        category,
        user:user_id (
          nickname,
          avatar
        )
      `
      )
      .range(offset, offset + perPage - 1);

    // 정렬 옵션 적용
    switch (sortOption) {
      case "최신순":
        query = query.order("created_at", { ascending: false });
        break;
      case "오래된순":
        query = query.order("created_at", { ascending: true });
        break;
      case "인기순":
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,contents.ilike.%${searchTerm}%`
      );
    }

    const { data: posts, error } = await query;

    // posts가 null인 경우 빈 배열로 처리
    if (!posts) {
      return NextResponse.json(
        { message: "조회 성공", data: [] },
        { status: 200 }
      );
    }

    // 댓글 수, 북마크 수 가져오기
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount, bookmarkCount] = await Promise.all([
          supabase
            .from("comments")
            .select("id", { count: "exact" })
            .eq("post_id", post.id)
            .then(({ count, error }) => (error ? 0 : count)),
          supabase
            .from("bookmark")
            .select("id", { count: "exact" })
            .eq("post_id", post.id)
            .then(({ count, error }) => (error ? 0 : count)),
        ]);

        return {
          ...post,
          comment_count: commentCount,
          bookmark_count: bookmarkCount,
        };
      })
    );

    // 인기순 정렬 적용
    let sortedPosts = postsWithCounts;
    if (sortOption === "인기순") {
      sortedPosts.sort((a, b) => {
        const bookmarkA = a.bookmark_count ?? 0;
        const bookmarkB = b.bookmark_count ?? 0;
        return bookmarkB - bookmarkA;
      });
    }
    console.log("이게 검색된 게시물이야!!", sortedPosts);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "검색 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    console.log("최종 반환 데이터:", { sortedPosts });

    return NextResponse.json({ sortedPosts });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
