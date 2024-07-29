import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('alarms')
      .select('id, alarm_time, alarm_medi_name');
    if (error) {
      console.error('Error fetching alarm records:', error);
      return NextResponse.json({ error: 'Failed to fetch alarm records' }, { status: 500 });
    }
    return NextResponse.json({ alarmRecords: data });
  } catch (error) {
    console.error('Error fetching alarm records:', error);
    return NextResponse.json({ error: 'Failed to fetch alarm records' }, { status: 500 });
  }
}
