import nodemailer from 'nodemailer';
import { generateNotificationMessage } from './notificationMessage';

const transporter = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 465,
  secure: true, // 포트 465는 SSL 사용
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 네이버 애플리케이션 비밀번호 사용
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = (options: MailOptions) => {
  const { to, subject, text, html } = options;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

// 사용 예시 (여기 부분은 sendEmail 함수 내에서 사용될 부분이 아니므로, sendEmail 함수 외부에서 사용될 때 추가적으로 필요한 코드입니다.)
const exampleUsage = async (newMediRecord: any, user: any) => {
  const { subject, message } = generateNotificationMessage({
    medi_nickname: newMediRecord.medi_nickname,
    medi_name: newMediRecord.medi_name,
    user_nickname: user.data.nickname,
    notes: newMediRecord.notes,
  });

  await sendEmail({
    to: user.data.email,
    subject,
    text: message,
  });
};
