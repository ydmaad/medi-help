import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from("calendar").select("*");

    if (error) {
      return NextResponse.json(error);
    }
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase error", error);
  }
}
