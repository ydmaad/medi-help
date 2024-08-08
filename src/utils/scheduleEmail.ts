import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail';
import { generateNotificationMessage } from './notificationMessage';

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

async function sendMedicationReminders() {
  const { data, error } = await supabase
    .from('medications')
    .select(`
      *,
      users (
        email,
        nickname
      )
    `)
    .eq('repeat', true);

  if (error) {
    console.error('Failed to fetch medication records:', error);
    return;
  }

  const today = new Date();
  const dayOfWeek = today.toLocaleString('ko-KR', { weekday: 'short' });
  const currentTime = today.toTimeString().slice(0, 5);

  for (const record of data) {
    const mediRecord: MediRecord = record;
    const userEmail = record.users.email;
    const userNickname = record.users.nickname;

    if (
      mediRecord.day_of_week.includes(dayOfWeek) &&
      mediRecord.notification_time.includes(currentTime)
    ) {
      const { subject, message } = generateNotificationMessage({
        medi_nickname: mediRecord.medi_nickname,
        medi_name: mediRecord.medi_name,
        user_nickname: userNickname,
        notes: mediRecord.notes,
      });

      await sendEmail({
        to: userEmail,
        subject,
        text: message,
      });

      console.log(`Email sent to ${userEmail} for medication ${mediRecord.medi_nickname}`);
    }
  }
}

// 매 분마다 스케줄링된 작업 실행
cron.schedule('* * * * *', sendMedicationReminders);
