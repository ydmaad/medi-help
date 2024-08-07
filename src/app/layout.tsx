import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEDI HELP",
  description: "MEDI HELP",
};

export default function HtmlLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
