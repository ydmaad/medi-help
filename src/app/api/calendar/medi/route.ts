import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('medications').select('*');
    if (error) {
      console.error('Error fetching medi records:', error);
      return NextResponse.json({ error: 'Failed to fetch medi records' }, { status: 500 });
    }
    return NextResponse.json({ medicationRecords: data });
  } catch (error) {
    console.error('Error fetching medi records:', error);
    return NextResponse.json({ error: 'Failed to fetch medi records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { medi_name, medi_nickname, times, notes, start_date, end_date, created_at } = await req.json();

    if (!medi_name || !medi_nickname || !times || !created_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('medications')
      .insert([{ medi_name, medi_nickname, times, notes, start_date, end_date, created_at }]);

    if (error) {
      console.error('Error saving medi record:', error);
      return NextResponse.json({ error: 'Failed to save medi record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Medi record saved', data }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting medi record:', error);
      return NextResponse.json({ error: 'Failed to delete medi record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Medi record deleted', data }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updatedFields } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('medications')
      .update(updatedFields)
      .eq('id', id);

    if (error) {
      console.error('Error updating medi record:', error);
      return NextResponse.json({ error: 'Failed to update medi record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Medi record updated', data }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
