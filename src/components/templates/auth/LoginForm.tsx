// 목적: 로그인 폼의 전체 구조와 로직을 관리하는 컴포넌트
// src/components/templates/auth/LoginForm.tsx

import React, { useState, useEffect } from "react";
import { AuthInput } from "../../atoms/AuthInput";
import { AuthButton } from "../../atoms/AuthButton";
import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
import { AuthCheckbox } from "../../molecules/AuthCheckbox";
import Link from "next/link";
import Image from "next/image";

type LoginFormProps = {
  onSubmit: (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onKakaoLogin: () => void;
  onGoogleLogin: () => void;
  error?: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onKakaoLogin,
  onGoogleLogin,
  error,
}) => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");

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

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!email || !password) {
      setFormError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    onSubmit({ email, password, rememberMe });
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 입력 필드 */}
        <AuthInput
          id="email" // id 추가
          name="email" // name 추가
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        {/* 비밀번호 입력 필드 */}
        <AuthPasswordInput
          id="password" // id 추가
          name="password" // name 추가
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
        {/* 에러 메시지 */}
        {formError && <AuthErrorMessage message={formError} />}
        {error && <AuthErrorMessage message={error} />}
        {/* 이메일 기억하기 체크박스 */}
        <div className="flex items-center justify-between">
          <AuthCheckbox
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="이메일 기억하기"
          />
        </div>
        {/* 로그인 버튼 */}
        <AuthButton type="submit" className="w-full bg-blue-500 text-white">
          로그인
        </AuthButton>
        {/* 비밀번호 찾기 및 회원가입 링크 */}
        <div className="flex justify-between text-sm mt-4">
          <Link href="/auth/reset" className="text-gray-600 hover:underline">
            비밀번호 찾기
          </Link>
          <Link href="/auth/signup" className="text-gray-600 hover:underline">
            회원가입
          </Link>
        </div>
      </form>
      {/* 간편 로그인 섹션 */}
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
            onClick={onGoogleLogin}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
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
            onClick={onKakaoLogin}
            className="w-full mt-2 py-2 px-4 border border-transparent rounded-md text-white bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center"
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
  );
};
