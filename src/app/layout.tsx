import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// header import 추후 삭제(로그인,회원가입 테스트)
import Header from "./header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function HtmlLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* header 추후 삭제(로그인,회원가입 테스트) */}
        <Header />
        {children}
      </body>
    </html>
  );
}
