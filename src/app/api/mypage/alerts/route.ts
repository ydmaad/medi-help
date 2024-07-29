import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from('alarm').select('*');

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }

    return NextResponse.json({ alerts: data });
  } catch (error: unknown) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { time, description } = await req.json();
    const { error } = await supabase.from('alarm').insert([{ time, description }]);

    if (error) {
      console.error('Failed to save alert:', error);
      return NextResponse.json({ error: 'Failed to save alert' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alert saved' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabase.from('alerts').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete alert:', error);
      return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Alert deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}