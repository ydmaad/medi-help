import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search") || "";

  // console.log("받은 검색어는 이거 맞아?:", searchTerm);

  const { data, error } = await supabase
    .from("posts")
    .select()
    .or(`title.ilike.%${searchTerm}%,contents.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
