import { NextRequest, NextResponse } from 'next/server';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/sendEmail';
import { generateNotificationMessage } from '@/utils/notificationMessage';
import '@/utils/scheduleEmail'; // 스케줄링 로직을 불러옵니다.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface MediRecord {
  id: string;
  medi_name: string;
  medi_nickname: string;
  times: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  notes: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  day_of_week: string[];
  notification_time: string[];
  repeat: boolean;
}

function isPostgrestError(error: any): error is PostgrestError {
  return error && typeof error === 'object' && 'message' in error && 'details' in error;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      console.error('GET request missing user_id parameter');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ medicationRecords: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Server error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newMediRecord: MediRecord = await req.json();

    const { data, error } = await supabase
      .from('medications')
      .insert([newMediRecord]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

      // Send Email
      const user = await supabase
      .from('users')
      .select('email, nickname')
      .eq('id', newMediRecord.user_id)
      .single();

    if (user.error || !user.data) {
      console.error('Failed to fetch user email:', user.error);
      return NextResponse.json({ error: 'Failed to fetch user email' }, { status: 500 });
    }

    const { subject, message } = generateNotificationMessage({
      medi_nickname: newMediRecord.medi_nickname,
      medi_name: newMediRecord.medi_name,
      user_nickname: user.data.nickname,
      notes: newMediRecord.notes,
    });

    try {
      await sendEmail({
        to: user.data.email,
        subject,
        text: message,
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return NextResponse.json({ medicationRecords: data }, { status: 201 });
  } catch (err: unknown) {
    console.error("Server error:", err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      console.error('PUT request missing id parameter');
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedMediRecord: MediRecord = await req.json();

    const { data, error } = await supabase
      .from('medications')
      .update(updatedMediRecord)
      .eq('id', id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send Email
    const user = await supabase
      .from('users')
      .select('email, nickname')
      .eq('id', updatedMediRecord.user_id)
      .single();

    if (user.error || !user.data) {
      console.error('Failed to fetch user email:', user.error);
      return NextResponse.json({ error: 'Failed to fetch user email' }, { status: 500 });
    }

    const { subject, message } = generateNotificationMessage({
      medi_nickname: updatedMediRecord.medi_nickname,
      medi_name: updatedMediRecord.medi_name,
      user_nickname: user.data.nickname,
      notes: updatedMediRecord.notes,
    });

    await supabase
    .from('medications')
    .update({is_sent : true})
    .eq('id',updatedMediRecord.id);

    await sendEmail({
      to: user.data.email,
      subject,
      text: message,
    });

    return NextResponse.json({ medicationRecords: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Server error:", err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      console.error('DELETE request missing id parameter');
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 먼저 calendar_medicine 테이블에서 참조된 레코드 삭제
    const { error: bridgeDeleteError } = await supabase
      .from('calendar_medicine')
      .delete()
      .eq('medicine_id', id);

    if (bridgeDeleteError) {
      console.error("Supabase error while deleting from calendar_medicine:", bridgeDeleteError);
      return NextResponse.json({ error: bridgeDeleteError.message }, { status: 500 });
    }

    // 이제 medications 테이블에서 약물을 삭제
    const { data, error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error while deleting from medications:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ medicationRecords: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Server error:", err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}