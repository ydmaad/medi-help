import { TablesInsert, TablesUpdate } from "./../../../types/supabase";
import { Tables } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type PostInsert = TablesInsert<"posts">; // 추가

// 게시글 불러오는 요청
export async function GET() {
  try {
    const { data, error } = await supabase.from("posts").select(`
        id,
        title,
        contents,
        img_url,
        created_at,
        user:user_id (
          nickname,
          avatar
        )
      `);
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
  console.log("포스트 요청 시작");
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

    // title, contents 유효성 검사
    if (!title || !contents) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다." });
    }

    // 이미지 파일 처리
    let img_url: string[] = [];
    const files = formData.getAll("image") as File[];

    for (const file of files) {
      if (file instanceof File) {
        const fileName = `${Date.now()}_${file.name}`;
        console.log(`업로드 시도: ${file.name}`);

        try {
          const { data: imgUploadData, error: imgUploadError } =
            await supabase.storage
              .from("posts_image_url")
              .upload(fileName, file);

          // console.log("Supabase 업로드 결과:", {
          //   imgUploadData,
          //   imgUploadError,
          // });

          if (imgUploadError) {
            console.error(`이미지 업로드 실패 : ${file.name}`, imgUploadError);
            continue;
          }
          const { data: urlData } = supabase.storage
            .from("posts_image_url")
            .getPublicUrl(fileName);

          // console.log("생성된 공개 URL:", urlData.publicUrl);
          img_url.push(urlData.publicUrl);
        } catch (uploadError) {
          console.error(
            `이미지 업로드 중 예외 발생: ${file.name}`,
            uploadError
          );
        }
      }
    }

    const postData: PostInsert = {
      title,
      contents,
      user_id: userId,
      img_url: img_url.join(","),
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
