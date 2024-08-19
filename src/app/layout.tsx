import type { Metadata } from "next";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientComponent from "@/components/molecules/ClientComponent";
import Providers from "@/app/provider";

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
      <body className="bg-[#FBFBFB]">
        <Providers>{children}</Providers>
        <ClientComponent />
      </body>
    </html>
  );
}
