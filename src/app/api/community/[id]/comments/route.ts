import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type Comment = Tables<"comments">; // 테이블을 읽어올때

type CommentInsert = TablesInsert<"comments">; // 등록

type CommentUpdate = TablesUpdate<"comments">; //수정

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

// 댓글 삭제하는 요청
// 해당 댓글을 삭제하는 유저가 댓글을 쓴 유저가 맞는지 확인하는 코드 필요
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { commentId } = await request.json();
  try {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("post_id", id);

    if (error) {
      return NextResponse.json({
        error: "댓글 삭제 실패",
        message: error.message,
      });
    }

    return NextResponse.json({ message: "댓글 삭제 성공" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "서버 오류",
      message: (error as Error).message,
    });
  }
}

// // 댓글 수정하는 요청
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   try {
//     const body: CommentUpdate = await request.json();

//     const { data, error } = await supabase
//       .from("posts")
//       .update(body)
//       .eq("id", commentId)
//       .eq("post_id", id);

//     if (error) {
//       return NextResponse.json({ error: "수정 실패", message: error.message });
//     }

//     return NextResponse.json({ message: "수정 성공", data });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       error: "Internal Server Error",
//       message: (error as Error).message,
//     });
//   }
// }

// 댓글 등록하는 요청
export async function POST(request: NextRequest) {
  try {
    const body: CommentInsert = await request.json();

    // 하드코딩한 부분!!
    // 나중에 auth 부분 성공시 수정하기!!
    // zustand로 유저 전역상태관리 예정!!
    const hardCodeId = "5bae80ae-6b5d-45de-ac5d-f1a89d2cc3ba";
    const commentData = {
      post_id: body.post_id,
      user_id: hardCodeId,
      comment: body.comment,
    };
    const { data, error } = await supabase
      .from("comments")
      .insert(commentData)
      .select();
    console.log(error);

    if (error) {
      return NextResponse.json(
        { error: "댓글 등록 실패", message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "댓글 등록 성공", data },
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
