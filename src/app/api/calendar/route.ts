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

    const { data: CalendarData, error: CalendarError } = await supabase
      .from("calendar")
      .upsert([{ id, side_effect, start_date, user_id }]);

    if (CalendarError) {
      return NextResponse.json(
        { error: CalendarError.message },
        { status: 500 }
      );
    }

    const { data: BridgeData, error: BridgeError } = await supabase
      .from("calendar_medicine")
      .upsert(medicineList)
      .select("*, medications:medicine_id(id, medi_nickname)");

    if (BridgeError) {
      console.log(BridgeError.message);
      return NextResponse.json({ error: BridgeError.message }, { status: 500 });
    }

    return NextResponse.json([BridgeData], { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("post error", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
