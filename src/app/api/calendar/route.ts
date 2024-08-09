import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ValueType } from "@/types/calendar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const values: ValueType = await req.json();
    const { id, side_effect, start_date, user_id, medicine_id, medi_time } =
      values;

    let medicineList = medicine_id.map((medi_id) => {
      return { calendar_id: id, user_id, medicine_id: medi_id, medi_time };
    });

    if (!id) {
      NextResponse.json("ID is required.");
    }

    const { data: CalendarData, error: CalendarError } = await supabase
      .from("calendar")
      .upsert([{ id, side_effect, start_date, user_id }])
      .eq("id", id);

    if (CalendarError) {
      return NextResponse.json(
        { error: CalendarError.message },
        { status: 500 }
      );
    }

    if (medicine_id.length !== 0) {
      const { data: BridgeDeleteData, error: BridgeDeleteError } =
        await supabase
          .from("calendar_medicine")
          .delete()
          .eq("calendar_id", id)
          .eq("medi_time", medi_time);

      if (BridgeDeleteError) {
        return NextResponse.json(
          { error: BridgeDeleteError.message },
          { status: 500 }
        );
      }

      const { data: BridgeInsertData, error: BridgeInsertError } =
        await supabase
          .from("calendar_medicine")
          .insert(medicineList)
          .select("*, medications:medicine_id(id, medi_nickname)");

      if (BridgeInsertError) {
        return NextResponse.json(
          { error: BridgeInsertError.message },
          { status: 500 }
        );
      }
      return NextResponse.json([BridgeInsertData]);
    }

    return NextResponse.json([CalendarData]);
  } catch (error) {
    console.log(error);
  }
}
