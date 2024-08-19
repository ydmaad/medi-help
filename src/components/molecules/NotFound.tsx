// src/components/molecules/NotFound.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NotFoundProps {
  message?: string;
  subMessage?: string;
  buttonText?: string;
  imageSrc?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  message = "페이지를 찾을 수 없어요",
  subMessage = "요청하신 페이지가 없거나 이용할 수 없는 페이지예요.",
  buttonText = "홈으로 돌아가기",
  imageSrc = "/404image.svg",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-100 px-4">
      <Image
        src={imageSrc}
        alt="Not Found"
        width={161}
        height={111}
        className="w-[161px] h-[111px]"
      />
      <h1 className="mt-[34px] text-[16px] desktop:text-[18px] font-bold text-brand-gray-1000 text-center">
        {message}
      </h1>
      <p className="mt-[8px] text-[13px] desktop:text-[16px] text-brand-gray-800 text-center">
        {subMessage}
      </p>
      <Link
        href="/"
        className="mt-[34px] w-[148px] h-[40px] desktop:w-[180px] desktop:h-[48px] flex items-center justify-center bg-brand-primary-500 text-white text-[16px] desktop:text-[18px] font-semibold rounded-md hover:bg-brand-primary-600 transition duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default NotFound;
