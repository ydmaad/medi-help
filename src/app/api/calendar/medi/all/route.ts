import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('id, medi_name');
    if (error) {
      console.error('Error fetching medication records:', error);
      return NextResponse.json({ error: 'Failed to fetch medication records' }, { status: 500 });
    }
    return NextResponse.json({ medicationRecords: data });
  } catch (error) {
    console.error('Error fetching medication records:', error);
    return NextResponse.json({ error: 'Failed to fetch medication records' }, { status: 500 });
  }
}
