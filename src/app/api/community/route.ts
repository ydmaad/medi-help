import { TablesInsert, TablesUpdate } from "./../../../types/supabase";
import { Tables } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type Post = Tables<"posts">; // 테이블을 읽어올때

type PostInsert = TablesInsert<"posts">; // 추가

type PostUpdate = TablesUpdate<"posts">; //수정

// 게시글 불러오는 요청
export async function GET() {
  try {
    const { data, error } = await supabase.from("posts").select("*");
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

// 게시글 등록하는 요청
export async function POST(request: NextRequest) {
  try {
    const body: PostInsert = await request.json();

    // POST 요청시 만든 formData
    const formData = await request.formData();

    // 이미지 파일 처리
    let img_url = null;
    const file = formData.get("image0") as File;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: imgUploadData, error: imgUploadError } =
        await supabase.storage.from("posts_image_url").upload(fileName, file);
      if (imgUploadError) {
        throw imgUploadError;
      }
      const { data: urlData } = supabase.storage
        .from("posts_image_url")
        .getPublicUrl(fileName);
      img_url = urlData.publicUrl;
    }

    // 하드코딩한 부분
    // 나중에 auth 부분 성공시 수정하기!!
    const hardCodeId = "dffc930c-0be8-47ac-91e8-18c437e5a70a";
    const bodyWithUserId = {
      ...body,
      user_id: hardCodeId,
      img_url,
    };

    // 게시글 데이터 삽입
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert(bodyWithUserId);
    console.log(postError);

    if (postError) {
      return NextResponse.json(
        { error: "등록실패", message: postError.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "등록성공", data: postData },
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

// 게시글 수정하는 요청
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body: PostUpdate = await request.json();

    const { data, error } = await supabase
      .from("posts")
      .update(body)
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
