import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from("test_calendar").select("*");

    if (error) {
      NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase error", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const values: any = await req.json();
    console.log(values);

    const { data, error } = await supabase.from("test_calendar").insert(values);

    if (error) {
      NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.log("post error", error);
    throw new Error(error.message);
  }
}
