import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/middleware";

export async function GET(req: NextRequest) {
  // const { supabase } = createClient(req);
  try {
    // const { data, error } = await supabase.from("daily_test").select("*");
    console.log("hi");
  } catch (error) {
    console.log("supabase error", error);
  }
}
