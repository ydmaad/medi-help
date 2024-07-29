import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { medi_name, times, alarm_time, notes } = await req.json();

    // Check if medication already exists
    const { data: existingMedi, error: existingMediError } = await supabase
      .from('medications')
      .select('id')
      .eq('medi_name', medi_name)
      .single();

    if (existingMediError && existingMediError.code !== 'PGRST116') {
      console.error('Error checking existing medication:', existingMediError);
      return NextResponse.json({ error: 'Failed to check existing medication' }, { status: 500 });
    }

    let medicationId;

    if (existingMedi) {
      medicationId = existingMedi.id;
    } else {
      // Insert new medication
      const { data, error } = await supabase
        .from('medications')
        .insert([{ medi_name, times, notes }])
        .select();

      if (error) {
        console.error('Failed to save medi record:', error);
        return NextResponse.json({ error: 'Failed to save medi record' }, { status: 500 });
      }

      medicationId = data[0].id;
    }

    // Insert alarm record
    const { error: alarmError } = await supabase
      .from('alarms')
      .insert([{ medication_id: medicationId, alarm_time, alarm_medi_name: medi_name }]);

    if (alarmError) {
      console.error('Failed to save alarm record:', alarmError);
      return NextResponse.json({ error: 'Failed to save alarm record' }, { status: 500 });
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
    const { error } = await supabase.from('alarms').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete record:', error);
      return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Record deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, alarm_time } = await req.json();
    const { error } = await supabase
      .from('alarms')
      .update({ alarm_time })
      .eq('id', id);

    if (error) {
      console.error('Failed to update alarm record:', error);
      return NextResponse.json({ error: 'Failed to update alarm record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alarm record updated' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
