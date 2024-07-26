import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type Comments = Tables<"comments">; // 읽어올때

type CommentInsert = TablesInsert<"comments">; // 추가

type CommentUpdate = TablesInsert<"comments">; // 수정

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`에러 : ${error}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("댓글을 가져올 수 없습니다. :", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const body: CommentInsert = await request.json();

//     // 하드코딩한 부분.
//     // 나중에 auth 부분 성공시 수정하기!!
//     const hardCodeId = "9b4cceb9-98bb-4742-8ce0-a7576edc0609";
//     const bodyWithUserId = {
//       ...body,
//       user_id: hardCodeId,
//     };
//     const { data, error } = await supabase
//       .from("posts")
//       .insert(bodyWithUserId)
//       .select();
//     console.log(error);

//     if (error) {
//       return NextResponse.json(
//         { error: "등록실패", message: error.message },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ message: "등록성공", data }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error", message: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   try {
//     const { data, error } = await supabase
//       .from("comments") // 나중에 테이블 수정!!
//       .delete()
//       .eq("id", id)
//       .select();

//     if (error) {
//       return NextResponse.json({ error: "삭제 실패", message: error.message });
//     }

//     if (data.length === 0) {
//       return NextResponse.json({ error: "댓글을 찾을 수 없습니다." });
//     }
//     return NextResponse.json({ message: "삭제 성공" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       message: (error as Error).message,
//     });
//   }
// }

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
//       .eq("id", id)
//       .select();

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
