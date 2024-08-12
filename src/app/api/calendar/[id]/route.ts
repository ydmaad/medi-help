// src/app/api/mypage/medi/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { data, error } = await supabase.from("medications").select().eq("id", id);

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { data: updatedData, error } = await req.json();

    if (!updatedData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("medications")
      .update(updatedData)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("supabase error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
