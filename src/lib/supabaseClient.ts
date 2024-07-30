import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

export async function getSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*');

  if (error) {
    console.error('Failed to fetch subscriptions:', error);
    return [];
  }

  return data;
}

export async function updateSubscriptions(subscriptions: any[]) {
  try {
    // 기존 구독 삭제
    await supabase
      .from('subscriptions')
      .delete()
      .neq('endpoint', '');

    // 새로운 구독 추가
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptions.map(subscription => ({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expirationTime: subscription.expirationTime,
      })));

    if (error) {
      console.error('Failed to update subscriptions:', error);
    }

    return data;
  } catch (error: any) {
    console.error('Error updating subscriptions:', error);
  }
}
