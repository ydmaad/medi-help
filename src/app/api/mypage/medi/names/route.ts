// src/app/api/mypage/medi/names/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

interface Item {
  itemName: string;
  itemImage: string | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  try {
    const { data: medications, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_E_MEDI_URL}?serviceKey=${process.env.NEXT_PUBLIC_E_MEDI_KEY}&pageNo=1&numOfRows=100&type=json`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('네트워크 응답에 문제가 있습니다.');
    }

    const data = await response.json();
    const items: Item[] = data.body.items || [];

    const formattedItems = items.map((item: Item) => ({
      itemName: item.itemName,
      itemImage: item.itemImage || null,
    }));

    const medicationsWithImages = medications.map((med) => {
      const foundItem = formattedItems.find((item) => item.itemName === med.medi_name);
      return {
        ...med,
        itemImage: foundItem ? foundItem.itemImage : null,
      };
    });

    return NextResponse.json(medicationsWithImages);
  } catch (error) {
    console.error('Error fetching medication records:', error);
    return NextResponse.json(
      { error: '데이터를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
