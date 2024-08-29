// src/app/(root)/auth/reset/page.tsx

"use client";

import React, { useState } from "react";
import {
  ResetPasswordForm,
  handleResetPassword,
} from "@/components/templates/auth/ResetPasswordForm";
import { useToast } from "@/hooks/useToast";
import Loading from "@/components/atoms/Loading";

// 비밀번호 재설정 요청 페이지
export default function ResetPasswordPage() {
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  // 토스트 알림 훅 사용
  const { toast } = useToast();

  // 비밀번호 재설정 요청 핸들러
  const onSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      await handleResetPassword(email);
      // 성공 시 토스트 알림 표시
      toast.success("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error) {
      // 오류 발생 시 토스트 알림 표시
      toast.error("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    } finally {
      // 작업 완료 후 로딩 상태 해제
      setIsLoading(false);
    }
  };

  // 로딩 중일 때 로딩 컴포넌트 표시
  if (isLoading) {
    return <Loading />;
  }

  // ResetPasswordForm 컴포넌트 렌더링
  return <ResetPasswordForm onSubmit={onSubmit} />;
}
