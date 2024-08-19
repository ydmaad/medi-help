import { NextRequest, NextResponse } from 'next/server';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import '@/utils/scheduleEmail';

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
  is_sent: boolean;
}

// 디바운스 함수 구현
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(func(...args)), delay);
    });
  };
};

// 실제 데이터를 가져오는 함수
const fetchMedicationData = async (user_id: string) => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', user_id)
    .eq('is_sent', false);

  if (error) {
    throw error;
  }

  return data;
};

// 디바운스된 fetchMedicationData 함수
const debouncedFetchMedicationData = debounce(fetchMedicationData, 300);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      console.error('GET request missing user_id parameter');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`Received GET request for user_id: ${user_id}`);

    const data = await debouncedFetchMedicationData(user_id);

    console.log(`Returning data for user_id: ${user_id}`);
    return NextResponse.json({ medicationRecords: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Server error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newMediRecord: MediRecord = await req.json();
    newMediRecord.is_sent = false;  // is_sent 필드 추가

    const { data, error } = await supabase
      .from('medications')
      .insert([newMediRecord]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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