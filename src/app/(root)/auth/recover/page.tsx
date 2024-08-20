// src/app/(root)/auth/recover/page.tsx

"use client";

import React, { useState } from "react";
import { RecoverPasswordForm } from "@/components/templates/auth/RecoverPasswordForm";
import { useToast } from "@/hooks/useToast";
import Loading from "@/components/atoms/Loading";
import { supabase } from "@/utils/supabase/client";

export default function RecoverPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordRecovery = async (password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return <RecoverPasswordForm onSubmit={handlePasswordRecovery} />;
}

// 기존 코드
// import { RecoverPasswordForm } from "@/components/templates/auth/RecoverPasswordForm";

// // 새 비밀번호 설정 페이지
// export default function RecoverPasswordPage() {
//   return <RecoverPasswordForm />;
// }
