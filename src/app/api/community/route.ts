import { TablesInsert, TablesUpdate } from "./../../../types/supabase";
import { Tables } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type Post = Tables<"test_posts">; // 테이블을 읽어올때

type DataInsert = TablesInsert<"test_posts">; // 추가

type DataUpdate = TablesUpdate<"test_posts">; //수정

export async function GET() {
  try {
    const { data, error } = await supabase.from("test_posts").select("*");
    console.log("된다!!", data);

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

export async function POST(request: NextRequest) {
  try {
    const body: DataInsert = await request.json();

    const hardCodeId = 123;
    const bodyWithUserId = {
      ...body,
      user_id: hardCodeId,
      nickname: "미내미",
      avatar:
        "https://images.unsplash.com/photo-1718839932371-7adaf5edc96a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      img_url:
        "https://images.unsplash.com/photo-1721631024252-212d160c8639?q=80&w=2547&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
    // avatar: string;
    // contents: string;
    // created_at?: string;
    // id?: number;
    // img_url: string;
    // nickname: string;
    // title: string;
    // user_id: number

    const { data, error } = await supabase
      .from("test_posts")
      .insert(bodyWithUserId)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "등록실패", message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "등록성공", data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}

// export async function DELETE(request : Request) {
//     const {id} = await request.json
//   const { data, error } = await supabase.from("posts").delete().eq("id", id);

//   if (error) {
//     return NextResponse.json(error.message);
//   }
//   return NextResponse.json(data);
// }
