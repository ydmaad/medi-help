"use client";
import React from "react";
import Link from "next/link";

interface TextButtonProps {
  text: string;
  href: string;
}

const TextButton = ({ text, href }: TextButtonProps) => {
  return (
    <div className="text-center text-gray-800 text-[16px] my-2 hover:font-bold">
      <Link href={href}>{text}</Link>
    </div>
  );
};

export default TextButton;
