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

export async function POST(request: NextRequest) {
  const body: DataInsert = await request.json();

  try {
    const { data, error } = await supabase
      .from("test_posts")
      .insert(body)
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
