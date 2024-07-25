import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const values: test_calendar = await req.json();
    const { data, error } = await supabase
      .from("test_calendar")
      .update(values)
      .eq("id", id);

    if (!id) {
      NextResponse.json("ID is required.");
    }

    if (error) {
      NextResponse.json({ error: error.message });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
