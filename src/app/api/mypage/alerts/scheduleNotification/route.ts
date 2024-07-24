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

webpush.setVapidDetails('mailto:your-email@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { time, description } = data;

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const alertTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    if (alertTime < now) {
      alertTime.setDate(alertTime.getDate() + 1);
    }

    const timeUntilAlert = alertTime.getTime() - now.getTime();

    setTimeout(async () => {
      const { data: subscriptions, error } = await supabase.from('subscriptions').select('*');

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
      }

      const payload = JSON.stringify({
        title: 'Test Alert',
        body: description || 'This is a test notification.',
        icon: '/default-icon.png',
        badge: '/default-badge.png',
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
    }, timeUntilAlert);

    const { error: insertError } = await supabase.from('alarm').insert([{ time, description }]);

    if (insertError) {
      console.error('Failed to save alert:', insertError);
      return NextResponse.json({ error: 'Failed to save alert' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alert scheduled' });
  } catch (error: unknown) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
