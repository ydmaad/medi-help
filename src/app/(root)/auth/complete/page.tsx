// src/app/auth/complete/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/hooks/useToast";
import Loading from "@/components/atoms/Loading";

const SignupSuccess: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // useAuthStore에서 필요한 함수와 상태를 가져옵니다.
  const { setIsLogedIn, user } = useAuthStore();

  // 홈으로 버튼 클릭 핸들러
  const handleHomeClick = () => {
    // 홈 페이지로 이동합니다.
    setIsLoading(true);
    toast.info("홈 페이지로 이동합니다.");
    router.push("/");
  };

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = () => {
    // 로그인 페이지로 이동합니다.
    setIsLoading(true);
    toast.info("로그인 페이지로 이동합니다.");
    router.push("/auth/login");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
        <h1 className="text-[26px] desktop:text-[28px] font-semibold text-brand-gray-800 mb-[40px]">
          회원가입이 완료되었습니다.
        </h1>
        <div className="flex justify-between">
          <button
            onClick={handleHomeClick} // 수정된 부분
            className="w-[156px] h-[48px] mr-[24px] text-[18px] font-semibold rounded
                       bg-brand-primary-50 text-brand-primary-500
                       hover:bg-brand-primary-100 transition-colors duration-300"
          >
            홈으로
          </button>
          <button
            onClick={handleLoginClick} // 수정된 부분
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
