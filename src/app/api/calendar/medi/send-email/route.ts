import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/sendEmail';
import { generateNotificationMessage } from '@/utils/notificationMessage';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface SendEmailRequestBody {
  user_id: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  const { user_id, subject, message }: SendEmailRequestBody = await req.json();

  const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('id', user_id)
    .single();

  if (error || !data) {
    console.error('Failed to fetch user email:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user email' }, { status: 500 });
  }

  const email = data.email;

  try {
    await sendEmail({
      to: email,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error('Failed to send email:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
