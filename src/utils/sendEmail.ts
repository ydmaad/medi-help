import nodemailer from 'nodemailer';

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
  const mailOptions = {
    from: process.env.EMAIL_USER,
    ...options,
  };

  return transporter.sendMail(mailOptions);
};
