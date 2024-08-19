"use client";
import Link from "next/link";

const SidebarLogoButton = () => {
  return (
    <>
      <Link
        href="/"
        className="flex my-[20px] ml-[20px] mr-[10px] items-center cursor-pointer"
      >
        <img src="/M.svg" alt="로고" className="w-[20px] h-[20px] " />
      </Link>
    </>
  );
};

export default SidebarLogoButton;
