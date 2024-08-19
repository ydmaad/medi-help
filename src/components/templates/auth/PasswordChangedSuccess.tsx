// src/components/templates/auth/PasswordChangedSuccess.tsx

import React from "react";
import { useRouter } from "next/navigation";

export const PasswordChangedSuccess: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
        {/* 제목 */}
        <h1 className="text-[25px] desktop:text-[28px] font-semibold text-brand-gray-800 mb-[60px]">
          비밀번호 변경이 완료되었습니다.
        </h1>

        {/* 버튼 컨테이너 */}
        <div className="flex justify-between">
          {/* 홈으로 버튼 */}
          <button
            onClick={() => router.push("/")}
            className="w-[156px] h-[48px] mr-[24px] text-[18px] font-semibold rounded 
                       bg-brand-primary-50 text-brand-primary-500 
                       hover:bg-brand-primary-100 transition-colors duration-300"
          >
            홈으로
          </button>

          {/* 로그인 버튼 */}
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
