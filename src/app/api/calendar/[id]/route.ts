import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("calendar")
      .select()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("supabase error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const values: test_calendar = await req.json();
    const { data, error } = await supabase
      .from("calendar")
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("calendar")
      .delete()
      .eq("id", id);

    console.log(data);
    if (!id) {
      NextResponse.json("ID is required.");
    }

    if (error) {
      NextResponse.json({ error: error.message });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log("supabase delete error", error);
  }
}
