import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

// DELETE 메서드
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // 먼저 calendar_medicine 테이블에서 참조된 레코드 삭제
    const { error: bridgeDeleteError } = await supabase
      .from('calendar_medicine')
      .delete()
      .eq('medicine_id', id);

    if (bridgeDeleteError) {
      console.error('Error deleting from calendar_medicine:', bridgeDeleteError);
      return NextResponse.json({ error: bridgeDeleteError.message }, { status: 500 });
    }

    // 이제 medications 테이블에서 약물을 삭제
    const { data, error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting from medications:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Record deleted successfully', data }, { status: 200 });
  } catch (err: unknown) {
    console.error('Server error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT 메서드
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    let updatedData = await req.json();
    console.log('Received update data:', updatedData);

    // itemImage 필드 제거
    const { itemImage, ...dataToUpdate } = updatedData;

    console.log('Data to update after removing itemImage:', dataToUpdate);

    const { data, error } = await supabase
      .from('medications')
      .update(dataToUpdate)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data && data.length > 0) {
      console.log('Updated medication:', data[0]);
      return NextResponse.json(data[0], { status: 200 });
    } else {
      return NextResponse.json({ error: 'No data updated' }, { status: 404 });
    }
  } catch (err: unknown) {
    console.error('Server error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}