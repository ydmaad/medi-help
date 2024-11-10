"use client";
import Link from "next/link";

const LogoButton = () => {
  return (
    <Link href="/" className="flex items-center cursor-pointer ">
      <img src="/MEDIHELP.svg" alt="로고" className="w-24 h-auto  " />
    </Link>
  );
};

export default LogoButton;
