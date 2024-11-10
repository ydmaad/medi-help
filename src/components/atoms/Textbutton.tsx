"use client";
import React from "react";
import Link from "next/link";

interface TextButtonProps {
  text: string;
  href: string;
  className?: string;
}

const TextButton = ({ text, href, className }: TextButtonProps) => {
  return (
    <div
      className={`text-center text-brand-gray-800 text-[16px] my-[10px] mx-[10px] hover:font-bold ${className}`}
    >
      <Link href={href}>{text}</Link>
    </div>
  );
};

export default TextButton;
