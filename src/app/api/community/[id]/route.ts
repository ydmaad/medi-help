import { cookies } from "next/headers";
import { TablesInsert, TablesUpdate } from "../../../../types/supabase";
import { Tables } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

type Post = Tables<"posts">; // 테이블을 읽어올때
type PostInsert = TablesInsert<"posts">; // 추가
type PostUpdate = TablesUpdate<"posts">; //수정

// 게시글 상세페이지 불러오는 요청
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        contents,
        img_url,
        created_at,
        user:user_id (
          nickname,
          avatar,
          id
        )
      `
      )
      .eq("id", id);
    // console.log("된다!!", data);

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

// 게시글 삭제하는 요청
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { data, error } = await supabase
      .from("posts") // 나중에 테이블 수정!!
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "삭제 실패", message: error.message });
    }

    return NextResponse.json({ message: "삭제 성공" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "서버 오류",
      message: (error as Error).message,
    });
  }
}

// 게시글 수정하는 요청
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const contents = formData.get("contents") as string;
    // URL 이미지 처리
    const imageUrls = formData.getAll("imageUrl") as string[];
    // 파일 이미지 처리
    const imageFiles = formData.getAll("imageFile") as File[];

    console.log("새로등록할 이미지", imageFiles);
    console.log("기존 이미지", imageUrls);

    // 파일 이미지를 supabase storage에 저장
    let newImageUrl = []; // 스트링만 담긴 배열
    for (const file of imageFiles) {
      const fileName = `${Date.now()}_${file.name}`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("posts_image_url")
          .upload(fileName, file);

        if (uploadError) {
          console.error(`이미지 업로드 실패 : ${file.name}`, uploadError);
          continue;
        }
        const { data: urlData } = supabase.storage
          .from("posts_image_url")
          .getPublicUrl(fileName);

        newImageUrl.push(urlData.publicUrl);
      } catch (uploadError) {
        console.error(`이미지 업로드 중 예외 발생: ${file.name}`, uploadError);
      }
    }

    const allImages = [...imageUrls, ...newImageUrl];

    const updateData = {
      title,
      contents,
      img_url: allImages.join(","),
    };

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: "수정 실패", message: error.message });
    }

    return NextResponse.json({ message: "수정 성공", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: (error as Error).message,
    });
  }
}
