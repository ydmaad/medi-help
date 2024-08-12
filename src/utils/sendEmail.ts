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
