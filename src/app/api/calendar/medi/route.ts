import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('medi').select('*');
    if (error) {
      console.error('Error fetching medi records:', error);
      return NextResponse.json({ error: 'Failed to fetch medi records' }, { status: 500 });
    }
    return NextResponse.json({ mediRecords: data });
  } catch (error) {
    console.error('Error fetching medi records:', error);
    return NextResponse.json({ error: 'Failed to fetch medi records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { medi_name, times, alarm_time, notes } = await req.json();
    const { error } = await supabase.from('medi').insert([{ medi_name, times, alarm_time, notes }]);
    if (error) {
      console.error('Failed to save medi record:', error);
      return NextResponse.json({ error: 'Failed to save medi record' }, { status: 500 });
    }
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
