"use client";

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
}

interface RealtimePayload {
  eventType: string;
  schema: string;
  table: string;
  new: MediRecord;
  old: MediRecord | null;
}

export default function ClientComponent() {
  useEffect(() => {
    const channel = supabase
      .channel('public:medications')
      .on<RealtimePayload>('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, (payload) => {
        const newRecord = payload.new as MediRecord;
        const subject = `Reminder: Time to take your medication ${newRecord.medi_nickname}`;
        const message = `It's time to take your medication ${newRecord.medi_nickname} (${newRecord.medi_name}) at ${newRecord.times.morning ? 'morning' : ''} ${newRecord.times.afternoon ? 'afternoon' : ''} ${newRecord.times.evening ? 'evening' : ''}. Notes: ${newRecord.notes}`;

        // Send Email
        axios.post('/api/calendar/medi/send-email', {
          user_id: newRecord.user_id,
          subject,
          message
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
