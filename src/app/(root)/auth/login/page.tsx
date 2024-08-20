// 목적: 로그인 페이지의 최상위 컴포넌트
// src/app/(root)/auth/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/templates/auth/LoginForm";
import { signInWithKakao } from "@/utils/supabase/kakaoAuth";
import { signInWithGoogle } from "@/utils/supabase/googleAuth";
import { useToast } from "@/hooks/useToast";
import Loading from "@/components/atoms/Loading";

export default function LoginPage() {
  const { setUser, setIsLogedIn } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return;
          }

          setUser(userData);
          setIsLogedIn(true);
          toast.success("로그인되었습니다.");
          router.push("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsLogedIn, router, toast]);

  // 이메일/비밀번호 로그인 핸들러
  const handleLogin = async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 이메일 기억하기 처리
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      toast.error("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithKakao();
      if (error) throw error;
    } catch (error) {
      console.error("Kakao login error:", error);
      setError("카카오 로그인 중 오류가 발생했습니다.");
      toast.error("카카오 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      setError("구글 로그인 중 오류가 발생했습니다.");
      toast.error("구글 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-[30px] desk:mt-auto flex justify-center items-center min-h-screen">
      <LoginForm
        onSubmit={handleLogin}
        onKakaoLogin={handleKakaoLogin}
        onGoogleLogin={handleGoogleLogin}
        error={error}
      />
    </div>
  );
}
