"use client";
import React from "react";
import Link from "next/link";

interface ImageButtonProps {
  src: string;
  alt: string;
  href: string;
}

const ImageButton = ({ src, alt, href }: ImageButtonProps) => {
  return (
    <div className="text-center my-2 hover:font-bold">
      <Link href={href}>
        <img src={src} alt={alt} className="cursor-pointer" />
      </Link>
    </div>
  );
};

export default ImageButton;
