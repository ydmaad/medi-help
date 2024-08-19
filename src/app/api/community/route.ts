import { TablesInsert } from "./../../../types/supabase";
import { supabase } from "@/utils/supabase/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type PostInsert = TablesInsert<"posts">; // 추가

// 게시글 불러오는 요청
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "6");
  // 페이지 시작 인덱스
  const offset = (page - 1) * perPage;
  const sortOption = searchParams.get("sort") || "최신순";

  try {
    // 총 게시글 수 조회
    const { count, error: countError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw countError;
    }

    // 정렬 옵션에 따른 쿼리 설정
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

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "데이터 조회 실패", message: error.message },
        { status: 400 }
      );
    }

    // posts가 null인 경우 빈 배열로 처리
    if (!posts) {
      return NextResponse.json(
        { message: "조회 성공", data: [] },
        { status: 200 }
      );
    }

    // 댓글 수와 북마크 수 가져오기
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

    // console.log("이게 전체 게시물이야!!", sortedPosts);
    return NextResponse.json(
      {
        message: "조회 성공",
        data: sortedPosts,
        totalPosts: count,
      },
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

// 게시글 등록하는 요청
export async function POST(request: NextRequest) {
  // console.log("포스트 요청 시작");
  const supabase = createRouteHandlerClient({ cookies });
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const userId = request.headers.get("User-Id");
    if (!userId) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." });
    }

    // 클라이언트에서 데이터 보내는 형식 : formData (json x)
    const formData = await request.formData();

    // console.log("받은 formData:", Object.fromEntries(formData));

    // formData에서 필드 추출
    const title = formData.get("title") as string;
    const contents = formData.get("contents") as string;
    const category = formData.get("category") as string;

    // title, contents, category 유효성 검사
    if (!title || !contents || !category) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다." });
    }

    // 이미지 파일 처리
    let img_url: string[] = [];
    const files = formData.getAll("image") as File[];

    for (const file of files) {
      if (file instanceof File) {
        const fileName = `${Date.now()}_${file.name}`;

        const { data: imgUploadData, error: imgUploadError } =
          await supabase.storage.from("posts_image_url").upload(fileName, file);

        if (imgUploadError) {
          console.error(`이미지 업로드 실패 : ${file.name}`, imgUploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("posts_image_url")
          .getPublicUrl(fileName);

        img_url.push(urlData.publicUrl);
      }
    }

    const postData: PostInsert = {
      title,
      contents,
      user_id: userId,
      category,
      img_url,
    };

    // 게시글 데이터 등록
    const { data: postUpdateData, error: postUpdateError } = await supabase
      .from("posts")
      .insert(postData);
    // console.log("삽입할 postData:", postData);
    // console.log("최종 img_url 배열:", img_url);
    // console.log("삽입된 데이터?", postUpdateError);

    if (postUpdateError) {
      return NextResponse.json(
        { error: "등록실패", message: postUpdateError.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "등록성공", data: postUpdateData },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
