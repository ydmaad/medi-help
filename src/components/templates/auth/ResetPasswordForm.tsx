// src/components/templates/auth/ResetPasswordForm.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthInput } from "@/components/atoms/AuthInput";
import { AuthButton } from "@/components/atoms/AuthButton";

export const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/recover`,
      });
      if (error) throw error;
      setMessage("비밀번호 재설정 링크를 이메일로 전송했습니다.");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`오류: ${error.message}`);
      } else {
        setMessage("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">비밀번호 재설정</h1>
      <form onSubmit={handleResetPassword}>
        <AuthInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
        />
        <AuthButton type="submit" className="w-full mt-4">
          재설정 링크 전송
        </AuthButton>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};
