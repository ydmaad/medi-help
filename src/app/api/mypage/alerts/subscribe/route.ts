import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { subscription, weekday } = await req.json();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expirationTime: subscription.expirationTime,
        weekday: weekday // 추가된 요일 필드
      });

    if (error) {
      console.error('Failed to save subscription:', error);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription saved' }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
