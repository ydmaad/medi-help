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
  const currentTime = now.toTimeString().slice(0, 5) + ":00"; // Ensure the time format is "HH:MM:00"
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
  .eq('is_sent', false);  // Ensure we only send emails that haven't been sent

if (error) {
  console.error('Failed to fetch medication records:', error);
  return;
}

console.log(`Found ${mediData.length} medications to process`);

// Take the first record only
if (mediData.length > 0) {
  const record = mediData[0];

  if (!record.users) {
    console.log(`Skipping record ${record.id} due to missing user data`);
    return;
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

    console.log(`Email sent to ${record.users.email} for medication ${record.medi_nickname}`);

    // Mark as sent
    await supabase
      .from('medications')
      .update({ is_sent: true })
      .eq('id', record.id);
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
  }
}
}

cron.schedule('* * * * *', sendScheduledEmails, {
  timezone: 'Asia/Seoul',
});

console.log('Email scheduling initialized');
