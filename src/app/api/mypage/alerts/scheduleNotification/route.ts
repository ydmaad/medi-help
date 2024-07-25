import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails('mailto:rla1eh2dus3@naver.com', vapidKeys.publicKey, vapidKeys.privateKey);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { time, description, days } = data;

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const alertTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    if (alertTime < now) {
      alertTime.setDate(alertTime.getDate() + 1);
    }

    const timeUntilAlert = alertTime.getTime() - now.getTime();

    // 알림 데이터를 Supabase에 저장
    const { error: insertError } = await supabase.from('alarm').insert([{ time, description, days }]);
    if (insertError) {
      console.error('Failed to insert alert:', insertError);
      return NextResponse.json({ error: 'Failed to insert alert' }, { status: 500 });
    }

    setTimeout(async () => {
      const { data: subscriptions, error } = await supabase.from('subscriptions').select('*');

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
      }

      const currentDay = new Date().toLocaleString('ko-KR', { weekday: 'short' });

      if (days.includes(currentDay)) {
        const payload = JSON.stringify({
          title: '약 먹을 시간이에요 💌',
          body: description || '이번 알람은 따로 설명이 없어요 :)',
          icon: 'https://example.com/default-icon.png',
          badge: 'https://example.com/default-badge.png',
          url: 'http://localhost:3000/',
        });

        if (subscriptions) {
          subscriptions.forEach((subscription: any) => {
            webpush.sendNotification(subscription, payload).then(response => {
              console.log('Notification sent:', response);
            }).catch((error: any) => {
              console.error('Error sending notification:', error);
            });
          });
        }
      }
    }, timeUntilAlert);

    return NextResponse.json({ message: 'Alert scheduled and saved to Supabase' });
  } catch (error: unknown) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
