import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const idNumber = parseInt(id, 10);

  if (isNaN(idNumber)) {
    return NextResponse.json(
      { error: "Invalid ID", message: "ID must be a number" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("search_medicine")
    .select("*")
    .eq("id", idNumber);

  if (error) {
    return NextResponse.json(
      { error: "데이터 조회 실패", message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
