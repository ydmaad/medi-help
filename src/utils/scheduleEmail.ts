import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail';
import { generateNotificationMessage } from './notificationMessage';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const sentEmails = new Set();

function getKoreanTime() {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
}

async function sendScheduledEmails() {
  const now = getKoreanTime();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm" 형식의 현재 시간
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
  .contains('notification_time', [`{${currentTime}}`]); // time을 배열로 처리
  if (error) {
      console.error('Failed to fetch medication records:', error);
      return;
  }

  console.log(`Found ${mediData.length} medications to process`);

  for (const record of mediData) {
      if (!record.users || sentEmails.has(record.id)) {
          console.log(`Skipping record ${record.id} due to missing user data or already sent`);
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

          sentEmails.add(record.id);
          console.log(`Email sent to ${record.users.email} for medication ${record.medi_nickname}`);
      } catch (emailError) {
          console.error('Failed to send email:', emailError);
      }
  }
}



// 매 분마다 스케줄링된 작업 실행
let isRunning = false;
cron.schedule('* * * * *', async () => {
  if (isRunning) {
    console.log('Previous job is still running. Skipping this run.');
    return;
  }
  isRunning = true;
  await sendScheduledEmails();
  isRunning = false;
}, {
  timezone: 'Asia/Seoul',
});

console.log('Email scheduling initialized');