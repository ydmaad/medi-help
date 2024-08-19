import nodemailer from 'nodemailer';
import { generateNotificationMessage } from './notificationMessage';

const transporter = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: MailOptions) => {
  const { to, subject, text, html } = options;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  console.log('Attempting to send email with options:', {
    ...mailOptions,
    text: mailOptions.text.substring(0, 100) + '...',  // 긴 텍스트는 일부만 로그에 출력
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// 이 함수는 예시용이므로 주석 처리하거나 필요 없다면 제거할 수 있습니다.
// const exampleUsage = async (newMediRecord: any, user: any) => {
//   const { subject, message } = generateNotificationMessage({
//     medi_nickname: newMediRecord.medi_nickname,
//     medi_name: newMediRecord.medi_name,
//     user_nickname: user.data.nickname,
//     notes: newMediRecord.notes,
//   });

//   await sendEmail({
//     to: user.data.email,
//     subject,
//     text: message,
//   });
// };

export default sendEmail;