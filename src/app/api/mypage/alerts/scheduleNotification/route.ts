import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSubscriptions, updateSubscriptions } from '@/lib/supabaseClient';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(req: NextRequest) {
  try {
    const { time, description } = await req.json();
    const subscriptions = await getSubscriptions();

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const alertTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    if (alertTime < now) {
      alertTime.setDate(alertTime.getDate() + 1);
    }

    const timeUntilAlert = alertTime.getTime() - now.getTime();

    console.log(`Alert scheduled for ${alertTime}. Time until alert: ${timeUntilAlert}ms`);

    setTimeout(async () => {
      const payload = JSON.stringify({
        title: 'Test Alert',
        body: description || 'This is a test notification.',
        icon: '/default-icon.png',
        badge: '/default-badge.png',
        url: 'http://localhost:3000/'
      });

      console.log(`Sending notification to ${subscriptions.length} subscriptions`);

      for (const subscription of subscriptions) {
        try {
          await webpush.sendNotification(subscription, payload);
          console.log('Notification sent:', subscription);
        } catch (error: any) {
          console.error('Error sending notification:', error);
          if (error.statusCode === 410 || error.statusCode === 404) {
            // 구독이 만료되거나 유효하지 않은 경우 제거
            console.log('Removing invalid subscription:', subscription);
            await updateSubscriptions(subscriptions.filter(sub => sub.endpoint !== subscription.endpoint));
          }
        }
      }
    }, timeUntilAlert);

    return NextResponse.json({ message: 'Alert scheduled' });
  } catch (error: any) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
