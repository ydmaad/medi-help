import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get("start_date");

    if (!start_date) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("calendar")
      .select("id, side_effect")
      .eq("start_date", start_date);

    if (error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase select error", error);
  }
}
