import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

type test_calendar = {
  name: string[];
  medi_time: string;
  sideEffect: string;
  user_id: string;
  time: string | null;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const values: test_calendar = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required." });
    }

    const { data, error } = await supabase
      .from("test_calendar")
      .update(values)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred." });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required." });
    }

    const { data, error } = await supabase
      .from("test_calendar")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase delete error", error);
    return NextResponse.json({ error: "An error occurred." });
  }
}
