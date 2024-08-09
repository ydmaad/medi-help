import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { start_date: string } }
) {
  try {
    const { start_date } = params;
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!start_date) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json({ error: "User is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("calendar")
      .select("id, side_effect")
      .eq("user_id", user_id)
      .eq("start_date", start_date);

    if (error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase select error", error);
  }
}
