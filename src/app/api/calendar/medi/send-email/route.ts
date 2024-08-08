import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/utils/sendEmail';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface SupabaseUser {
  email: string;
}

interface SendEmailRequestBody {
  user_id: string;
  subject: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user_id, subject, message }: SendEmailRequestBody = req.body;

    // Supabase에서 사용자 이메일 가져오기
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', user_id)
      .single();

    if (error || !data) {
      console.error('사용자 이메일을 가져오는데 실패했습니다:', error);
      return res.status(500).json({ success: false, error: '사용자 이메일을 가져오는데 실패했습니다' });
    }

    const email = (data as SupabaseUser).email;

    try {
      await sendEmail({
        to: email,
        subject: subject,
        text: message,
      });

      res.status(200).json({ success: true });
    } catch (error: unknown) {
      console.error('이메일을 보내는데 실패했습니다:', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  }
}
