import { ValuesType } from "@/types/calendar";
import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      NextResponse.json("ID is required.");
    }

    const values: ValuesType = await req.json();
    const { side_effect, start_date, user_id, medicine_id, medi_time } = values;

    const medicineList = medicine_id.map((medi_id) => {
      return { calendar_id: id, user_id, medicine_id: medi_id, medi_time };
    });

    const { data: CalendarData, error: CalendarError } = await supabase
      .from("calendar")
      .update({ side_effect })
      .eq("id", id)
      .select();

    if (CalendarError) {
      return NextResponse.json(
        { error: CalendarError.message },
        { status: 500 }
      );
    }

    const { data: BridgeDeleteData, error: BridgeDeleteError } = await supabase
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

    if (medicine_id.length !== 0) {
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
      return NextResponse.json([CalendarData, BridgeInsertData]);
    }

    return NextResponse.json([CalendarData]);
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
