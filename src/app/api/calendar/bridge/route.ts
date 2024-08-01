import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const calendarId = searchParams.get('calendar_id');
    try {
        const { data, error } = await supabase.from("medi_calendar").select().eq("calendar_id", calendarId);
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
        const newMediRecord = await req.json();

        const response = await supabase
            .from('medi_calendar')
            .insert([newMediRecord]);

        console.log(response)

        if (response.error) {
            console.error("Supabase error:", response.error);
            return NextResponse.json({ error: response.error.message }, { status: 500 });
        }

        console.log("datadatadatadatadatadata", response.error);

        return NextResponse.json({ medicationRecords: response.error }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
