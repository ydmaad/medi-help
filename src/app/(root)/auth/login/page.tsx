"use client";

import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();

  // 이메일 기억하기 기능
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 로그인 폼 제출 처리
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 입력 검증
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      // Supabase를 통한 로그인 처리
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      // 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) throw userError;

      // 로그인 성공 처리
      setUser(userData);

      // 이메일 기억하기 처리
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // 메인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("이메일, 비밀번호를 다시 입력해 주세요.");
    }
  };

  // 소셜 로그인 핸들러 (미구현)
  const handleGoogleLogin = async () => {
    alert("Google 로그인 기능은 아직 구현되지 않았습니다.");
  };

  const handleKakaoLogin = async () => {
    alert("Kakao 로그인 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 이메일 입력 필드 */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* 비밀번호 입력 필드 */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {/* 비밀번호 표시/숨김 토글 버튼 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Image
                src={
                  showPassword ? "/close_eye_icon.svg" : "/open_eye_icon.svg"
                }
                alt="Toggle password visibility"
                width={18}
                height={12}
              />
            </button>
          </div>
          {/* 에러 메시지 표시 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* 이메일 기억하기 체크박스 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              이메일 기억하기
            </label>
          </div>
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-brand-primary-500 text-white py-2 rounded-md"
          >
            로그인
          </button>
        </form>
        {/* 계정 관련 링크 */}
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>
            <Link href="/auth/find-id" className="mr-2">
              계정 찾기
            </Link>
            |
            <Link href="/auth/find-password" className="ml-2">
              비밀번호 찾기
            </Link>
          </span>
          <Link href="/auth/signup">회원가입</Link>
        </div>
        {/* 소셜 로그인 섹션 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">간편 로그인</span>
            </div>
          </div>
          <div className="mt-6">
            {/* 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md mb-2"
            >
              <Image
                src="/google_icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              구글 로그인
            </button>
            {/* 카카오 로그인 버튼 */}
            <button
              onClick={handleKakaoLogin}
              className="flex items-center justify-center w-full py-2 bg-yellow-300 rounded-md"
            >
              <Image
                src="/kakao_icon.svg"
                alt="Kakao"
                width={20}
                height={20}
                className="mr-2"
              />
              카카오 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
