import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      NextResponse.json("ID is required.");
    }

    const { data, error } = await supabase
      .from("calendar")
      .delete()
      .eq("id", id);

    if (error) {
      NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase delete error", error);
  }
}
