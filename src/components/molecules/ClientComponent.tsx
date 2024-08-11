"use client";

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ClientComponent() {
  useEffect(() => {
    const channel = supabase
      .channel('public:medications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, (payload) => {
        // 이 부분에서 필요하지 않은 즉시 알림 전송 로직을 제거합니다.
        console.log('Database change detected:', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
