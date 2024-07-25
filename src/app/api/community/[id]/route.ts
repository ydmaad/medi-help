import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from("test_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`뭔가 에러가 났얼 : ${error}`);
    }

    if (!data) {
      return NextResponse.json({ error: "게시글이 업" });
    }

    // const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("뭔가 안가져오는 듯 :", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
