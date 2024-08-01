import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing user_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching medication records:", error);
      return NextResponse.json(
        { error: "Failed to fetch medication records" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching medication records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medication records" },
      { status: 500 }
    );
  }
}
