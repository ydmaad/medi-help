import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from("calendar").select("*");

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

    const { data, error } = await supabase.from("calendar").insert(values);

    if (error) {
      NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log("post error", error);
      throw new Error(error.message);
    }
  }
}
