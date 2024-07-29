import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from("medi").select("*");

    if (error) {
      return NextResponse.json(error);
    }
    console.log(data);
    return NextResponse.json({ mediRecords: data });
  } catch (error) {
    console.log("supabase error", error);
    return NextResponse.json({ error: "Failed to fetch medi records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { medi_name, time, notes } = await req.json();
    console.log('Received data:', { medi_name, time, notes });

    const { data, error } = await supabase.from('medi').insert([{ medi_name, time, notes }]);
    if (error) {
      console.error('Failed to save medi record:', error);
      return NextResponse.json({ error: 'Failed to save medi record' }, { status: 500 });
    }

    console.log('Medi record saved successfully:', data);
    return NextResponse.json({ message: 'Medi record saved' }, { status: 201 });
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabase.from('medi').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete medi record:', error);
      return NextResponse.json({ error: 'Failed to delete medi record' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Medi record deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
