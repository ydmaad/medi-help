import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail';
import { generateNotificationMessage } from './notificationMessage';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getKoreanTime() {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
}

async function sendScheduledEmails() {
  const now = getKoreanTime();
  const currentTime = now.toTimeString().slice(0, 5);
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];

  console.log(`Checking for emails to send at ${currentTime} on ${dayOfWeek}`);

  const { data: mediData, error } = await supabase
    .from('medications')
    .select(`
      *,
      users (
        email,
        nickname
      )
    `)
    .contains('day_of_week', [dayOfWeek])
    .contains('notification_time', [currentTime])
    .eq('is_sent', false);

  if (error) {
    console.error('Failed to fetch medication records:', error);
    return;
  }

  console.log(`Found ${mediData?.length || 0} medications to process`);

  for (const record of mediData || []) {
    if (!record.users) {
      console.log(`Skipping record ${record.id} due to missing user data`);
      continue;
    }

    const { subject, message } = generateNotificationMessage({
      medi_nickname: record.medi_nickname,
      medi_name: record.medi_name,
      user_nickname: record.users.nickname,
      notes: record.notes,
    });

    try {
      await sendEmail({
        to: record.users.email,
        subject,
        text: message,
      });

      // 이메일 발송 후 is_sent 필드를 true로 업데이트
      const { error: updateError } = await supabase
        .from('medications')
        .update({ is_sent: true })
        .eq('id', record.id);

      if (updateError) {
        console.error(`Failed to update is_sent for record ${record.id}:`, updateError);
      } else {
        console.log(`Email sent and is_sent updated for ${record.users.email}, medication ${record.medi_nickname}`);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
  }
}

// 전역 변수를 사용하여 cron job이 한 번만 설정되도록 함
let cronJob: cron.ScheduledTask | null = null;

if (!cronJob) {
  cronJob = cron.schedule('* * * * *', sendScheduledEmails, {
    timezone: 'Asia/Seoul',
  });
  console.log('Email scheduling initialized');
}

export { sendScheduledEmails };