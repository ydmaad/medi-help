// src/app/auth/complete/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SignupSuccess: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
        <h1 className="text-[26px] desktop:text-[28px] font-semibold text-brand-gray-800 mb-[40px]">
          회원가입이 완료되었습니다.
        </h1>
        <div className="flex justify-between">
          <button
            onClick={() => router.push("/")}
            className="w-[156px] h-[48px] mr-[24px] text-[18px] font-semibold rounded 
                       bg-brand-primary-50 text-brand-primary-500 
                       hover:bg-brand-primary-100 transition-colors duration-300"
          >
            홈으로
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-[204px] h-[48px] text-[18px] font-semibold rounded 
                       bg-brand-primary-500 text-white 
                       hover:bg-brand-primary-600 transition-colors duration-300"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
