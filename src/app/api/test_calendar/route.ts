import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from("test_calendar").select("*");

    if (error) {
      NextResponse.json(error);
    }
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase error", error);
  }
}
