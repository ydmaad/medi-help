import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail';
import { generateNotificationMessage } from './notificationMessage';

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
  day_of_week: string[];
  notification_time: string[];
  repeat: boolean;
}

function getKoreanTime() {
  const now = new Date();
  const utcOffset = now.getTime() + now.getTimezoneOffset() * 60000;
  const koreanTime = new Date(utcOffset + 9 * 3600000); // UTC+9 for Korea Standard Time
  return koreanTime;
}

async function sendScheduledEmails() {
  const now = getKoreanTime();
  const currentTime = now.toTimeString().slice(0, 5);
  const dayOfWeek = now.toLocaleString('ko-KR', { weekday: 'short' });

  const { data: madiData, error } = await supabase
    .from('medications')
    .select(`
      *,
      users (
        email,
        nickname
      )
    `)
    .not('day_of_week', 'is', null)
    .not('notification_time', 'is', null)
    .not('is_sent', 'is', null)
      
  if (error) {
    console.error('Failed to fetch medication records:', error);
    return;
  }

  const data = madiData.filter(f => f.users);

  for (const record of data) {
    const mediRecord: MediRecord = record;
    const userEmail = record.users.email;
    const userNickname = record.users.nickname;

    if(!mediRecord.day_of_week.length || !mediRecord.notification_time.length)
      continue;

    if (
      mediRecord.day_of_week.includes(dayOfWeek) &&
      mediRecord.notification_time[0].includes(currentTime)
    ) {
      const { subject, message } = generateNotificationMessage({
        medi_nickname: mediRecord.medi_nickname,
        medi_name: mediRecord.medi_name,
        user_nickname: userNickname,
        notes: mediRecord.notes,
      });

      try {

        await supabase
        .from('medications')
        .update({is_sent : true})
        .eq('id', mediRecord.id);

        await sendEmail({
          to: userEmail,
          subject,
          text: message,
        });

       
        //테이블 값 수정시키는 로직 추가
        console.log(`Email sent to ${userEmail} for medication ${mediRecord.medi_nickname}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }
  }
}

// 매 분마다 스케줄링된 작업 실행
cron.schedule('* * * * *', sendScheduledEmails, {
  timezone: 'Asia/Seoul',
});
