// // 목적: 로그인 폼의 전체 구조와 로직을 관리하는 컴포넌트
// src/components/templates/auth/LoginForm.tsx

import React, { useState, useEffect } from "react";
import { AuthInput } from "../../atoms/AuthInput";
import { AuthButton } from "../../atoms/AuthButton";
import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
import { AuthCheckbox } from "../../molecules/AuthCheckbox";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";

// LoginForm 컴포넌트의 props 타입 정의
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
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // 토스티파이 훅 사용
  const { toast } = useToast();

  // 이메일 기억하기 기능
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail) || newEmail === "");
    if (!validateEmail(newEmail) && newEmail !== "") {
      toast.error("올바른 이메일 형식이 아닙니다.");
    }
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(newPassword.length >= 6 || newPassword === "");
    if (newPassword.length < 6 && newPassword !== "") {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      setIsEmailValid(false);
      return;
    }
    if (password.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      setIsPasswordValid(false);
      return;
    }
    onSubmit({ email, password, rememberMe });
  };

  return (
    <div className="w-[335px] desktop:w-[384px] max-w-md">
      <h2 className="text-[28px] font-bold text-brand-gray-800 text-center mb-[24px]">
        로그인
      </h2>
      <form onSubmit={handleSubmit}>
        {/* 이메일 입력 필드 */}
        <div className="mb-[16px] text-brand-gray-400 desktop:text-brand-gray-600">
          <AuthInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일"
            isValid={isEmailValid}
          />
          {!isEmailValid && (
            <p className="text-[#F66555] text-sm mt-1">
              이메일을 다시 입력해 주세요.
            </p>
          )}
        </div>
        {/* 비밀번호 입력 필드 */}
        <div className="mb-[8px] text-brand-gray-400 desktop:text-brand-gray-600">
          <AuthPasswordInput
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
            isValid={isPasswordValid}
          />
          {!isPasswordValid && (
            <p className="text-[#F66555] text-sm mt-1">
              비밀번호를 다시 입력해 주세요.
            </p>
          )}
          {/* 에러 메시지 */}
          {formError && <AuthErrorMessage message={formError} />}
          {error && <AuthErrorMessage message={error} />}
        </div>
        <div>
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
          <AuthButton
            type="submit"
            className="bg-brand-primary-500 hover:bg-brand-primary-600 font-bold text-white mt-[8px] transition duration-300 ease-in-out"
          >
            로그인
          </AuthButton>
        </div>

        {/* 비밀번호 찾기 및 회원가입 링크 */}
        <div className="flex w-full justify-between text-sm mt-[8px] py-[10px]">
          <Link
            href="/auth/reset"
            className="text-brand-gray-800 hover:underline"
          >
            비밀번호 찾기
          </Link>
          <Link
            href="/auth/signup"
            className="text-brand-gray-800 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </form>
      {/* 간편 로그인 섹션 */}
      <div className="mt-[14px]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm ">
            <span className="p-[10px] text-[16px] bg-[#fbfbfb] text-brand-gray-600">
              간편 로그인
            </span>
          </div>
        </div>
        <div className="mt-[16px]">
          {/* 구글 로그인 버튼 */}
          <button
            onClick={onGoogleLogin}
            className="w-full h-[45px] text-[14px] py-2 px-4 border border-brand-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <Image
              src="/google_icon.svg"
              alt="Google"
              width={18}
              height={18}
              className="mr-2"
            />
            구글 로그인
          </button>
          {/* 카카오 로그인 버튼 */}
          <button
            onClick={onKakaoLogin}
            className="w-full h-[45px] text-[14px] mt-[16px] py-2 px-4 border border-transparent rounded-md  bg-[#fee500] hover:bg-yellow-300 flex items-center justify-center"
          >
            <Image
              src="/kakao_icon.svg"
              alt="Kakao"
              width={18}
              height={18}
              className="mr-2"
            />
            카카오 로그인
          </button>
        </div>
      </div>
    </div>
  );
};
