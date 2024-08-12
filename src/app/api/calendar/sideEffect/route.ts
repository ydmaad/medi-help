import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  try {
    if (!user_id) {
      return NextResponse.json({ error: "User is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("calendar")
      .select()
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase select error", error);
  }
}
