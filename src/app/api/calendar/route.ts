import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { ValuesType } from "@/types/calendar";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("calendar")
      .select(
        "*, calendar_medicine:id(id, medi_time, medications:medicine_id(id, medi_nickname))"
      )
      .eq("user_id", userId);

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

export async function POST(req: NextRequest) {
  try {
    const values: ValuesType = await req.json();
    const { id, side_effect, start_date, user_id, medicine_id, medi_time } =
      values;

    const { data: CalendarData, error: CalendarError } = await supabase
      .from("calendar")
      .insert({ id, side_effect, start_date, user_id })
      .select();

    if (CalendarError) {
      return NextResponse.json({ error: "캘린더" });
    }

    if (medicine_id.length > 0) {
      const medicineList = medicine_id.map((medi_id) => {
        return { calendar_id: id, user_id, medicine_id: medi_id, medi_time };
      });

      const { data: BridgeInsertData, error: BridgeInsertError } =
        await supabase
          .from("calendar_medicine")
          .insert(medicineList)
          .select("*, medications:medicine_id(id, medi_nickname)");

      if (BridgeInsertError) {
        return NextResponse.json({ error: BridgeInsertError.message });
      }

      return NextResponse.json([CalendarData, BridgeInsertData]);
    }
    return NextResponse.json([CalendarData]);
  } catch (error) {
    console.error(error);
  }
}
