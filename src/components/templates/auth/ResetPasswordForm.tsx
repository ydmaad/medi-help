// src/components/templates/auth/ResetPasswordForm.tsx

"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthInput } from "@/components/atoms/AuthInput";
import { useToast } from "@/hooks/useToast";

// ResetPasswordForm 컴포넌트의 props 타입 정의
interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
}

// 비밀번호 재설정 요청을 수행하는 함수
export const handleResetPassword = async (email: string) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://medi-help-seven.vercel.app";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/recover`,
  });
  if (error) throw error;
};

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
}) => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 토스트 알림 훅 사용
  const { toast } = useToast();

  // 비밀번호 재설정 요청 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 부모 컴포넌트로부터 전달받은 onSubmit 함수 호출
      await onSubmit(email);
      // 요청 성공 시 상태 업데이트
      setIsSubmitted(true);
    } catch (error) {
      // 오류 발생 시 토스트 알림 표시
      toast.error("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto w-[334px] desktop:w-[384px]">
        <div className="text-[28px] text-brand-gray-800 text-center font-bold mb-[40px]">
          비밀번호 찾기
        </div>
        <form onSubmit={handleSubmit}>
          <AuthInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <div className="mt-[4px] text-[12px] text-brand-gray-600">
            가입하신 이메일을 입력해주세요.
          </div>
          <button
            type="submit"
            className={`h-[48px] mt-[40px] font-semibold text-[18px] w-full rounded-md transition-colors duration-300 ${
              isSubmitted
                ? "!bg-brand-gray-200 !text-brand-gray-600"
                : "!bg-brand-primary-500 !text-white"
            }`}
            disabled={isSubmitted}
          >
            {isSubmitted ? "전송완료" : "재설정 링크 전송"}
          </button>
        </form>
      </div>
    </div>
  );
};
