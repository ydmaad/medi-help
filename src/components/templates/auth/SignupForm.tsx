// 목적: 회원가입 폼의 전체 구조와 로직을 관리하는 컴포넌트
// src/components/templates/auth/SignupForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { AuthInput } from "../../atoms/AuthInput";
import { AuthButton } from "../../atoms/AuthButton";
import { AuthPrimaryButton } from "../../atoms/AuthPrimaryButton";
import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
import { AuthTermsCheckbox } from "../../molecules/AuthTermsCheckbox";
import { termsOfService } from "@/constants/termsOfService";
import { privacyPolicy } from "@/constants/privacyPolicy";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/hooks/useToast";

// SignupForm 컴포넌트의 props 타입 정의
type SignupFormProps = {
  onSubmit: (data: {
    nickname: string;
    email: string;
    password: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => void;
  error?: string;
};

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, error }) => {
  // 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 유효성 상태 관리
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordConfirmValid, setPasswordConfirmValid] = useState<
    boolean | null
  >(null);

  // 토스티파이 훅 사용
  const { toast } = useToast();

  // 이메일 중복 확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  // 닉네임 중복 확인 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 폼 유효성 검사 함수
  const isFormValid = () => {
    return (
      nicknameValid === true &&
      isNicknameAvailable &&
      emailValid === true &&
      isEmailChecked &&
      isEmailAvailable &&
      passwordValid === true &&
      passwordConfirmValid === true &&
      agreeTerms &&
      agreePrivacy
    );
  };

  // 이메일 중복 확인 함수
  const checkEmail = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (error) {
      console.error(error.message);
      return false;
    }
    return data.length === 0;
  };

  // 닉네임 중복 확인 함수
  const checkNickname = async (nickname: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname);

    if (error) {
      console.error(error.message);
      return false;
    }
    return data.length === 0;
  };

  // 이메일 중복 확인 핸들러
  const handleEmailCheck = async () => {
    if (!email || !emailValid) {
      toast.error("유효한 이메일을 입력해주세요.");
      return;
    }

    const isAvailable = await checkEmail(email);
    setIsEmailChecked(true);
    setIsEmailAvailable(isAvailable);

    if (isAvailable) {
      toast.success("사용 가능한 이메일입니다.");
    } else {
      toast.error("이미 사용 중인 이메일입니다.");
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);

    if (newNickname.length >= 2 && newNickname.length <= 6) {
      const isAvailable = await checkNickname(newNickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(isAvailable);
      setNicknameValid(true); // 길이 조건을 만족하면 우선 유효하다고 설정
      if (!isAvailable) {
        toast.error("이미 사용 중인 닉네임입니다.");
      }
    } else {
      setNicknameValid(false);
      if (newNickname) {
        // toast.error("닉네임은 2-6자 사이여야 합니다.");
      }
    }
  };

  // 이메일 변경 시 중복 확인 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  }, [email]);

  // 이메일 유효성 검사
  useEffect(() => {
    if (email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(null);
    }
  }, [email]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (password !== "") {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 6;

      setPasswordValid(
        hasLetter && hasNumber && hasSpecialChar && isLongEnough
      );
    } else {
      setPasswordValid(null);
    }
  }, [password]);

  // 비밀번호 확인 유효성 검사
  useEffect(() => {
    if (passwordConfirm !== "") {
      setPasswordConfirmValid(password === passwordConfirm);
    } else {
      setPasswordConfirmValid(null);
    }
  }, [password, passwordConfirm]);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
    } else {
      // 에러 메시지 표시 로직
      let errors = [];
      if (!nicknameValid || !isNicknameAvailable)
        errors.push("닉네임을 확인해주세요.");
      if (!emailValid || !isEmailChecked || !isEmailAvailable)
        errors.push("이메일을 확인해주세요.");
      if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
      if (!passwordConfirmValid)
        errors.push("비밀번호 확인이 일치하지 않습니다.");
      if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

      toast.error(errors.join("\n"));
    }
  };

  return (
    <div className="w-[336px] desktop:w-[386px] max-w-md">
      <h2 className="text-[28px] font-bold text-center text-brand-gray-800 mb-6">
        회원 가입
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 닉네임 입력 필드 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            닉네임
          </label>
          <AuthInput
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임 설정"
            className="w-full px-3 py-2"
            isValid={nicknameValid !== false}
          />
          {nicknameValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              사용할 수 없는 닉네임입니다.
            </p>
          )}
          {isNicknameChecked && isNicknameAvailable && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              사용할 수 있는 닉네임입니다.
            </p>
          )}
          {nicknameValid === true &&
            isNicknameChecked &&
            !isNicknameAvailable && (
              <p className="text-[#F66555] text-[12px] mt-1">
                이미 사용 중인 닉네임입니다.
              </p>
            )}
        </div>

        {/* 이메일 입력 필드 */}
        <div>
          <label
            htmlFor="email"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            이메일 입력
          </label>
          <div className="flex items-center justify-between">
            <AuthInput
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@도메인.com"
              className="px-3 py-2 text-brand-gray-1000"
              isValid={
                emailValid !== false && (!isEmailChecked || isEmailAvailable)
              }
            />
            <div>
              <AuthPrimaryButton
                onClick={handleEmailCheck}
                className="px-1 ml-[10px]"
                isActive={emailValid === true}
              >
                중복확인
              </AuthPrimaryButton>
            </div>
          </div>
          {emailValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}
          {emailValid === true && !isEmailChecked && (
            <p className="text-[#F66555] text-[12px] mt-1">
              이메일 중복 확인이 필요합니다.
            </p>
          )}
          {isEmailChecked && isEmailAvailable && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              사용할 수 있는 이메일입니다.
            </p>
          )}
          {isEmailChecked && !isEmailAvailable && (
            <p className="text-[#F66555] text-[12px] mt-1">
              이미 사용 중인 이메일입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div>
          <label
            htmlFor="password"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            비밀번호 입력
          </label>
          <AuthPasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
            isValid={passwordValid !== false}
          />
          {passwordValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              영문자, 숫자, 특수문자 포함하여 최소 6자 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            비밀번호 확인
          </label>
          <AuthPasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="다시 한번 입력해 주세요."
            isValid={passwordConfirmValid !== false}
          />
          {passwordConfirmValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          {passwordConfirmValid === true && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              비밀번호가 일치합니다.
            </p>
          )}
        </div>

        {/* 약관 동의 체크박스 */}
        <AuthTermsCheckbox
          id="agreeTerms"
          checked={agreeTerms}
          onChange={setAgreeTerms}
          label="이용약관 동의 (필수)"
          modalTitle="이용약관"
          modalContent={termsOfService}
        />
        <AuthTermsCheckbox
          id="agreePrivacy"
          checked={agreePrivacy}
          onChange={setAgreePrivacy}
          label="개인정보 처리방침 동의 (필수)"
          modalTitle="개인정보 처리방침"
          modalContent={privacyPolicy}
        />

        {/* 에러 메시지 */}
        {error && <AuthErrorMessage message={error} />}

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={`w-full h-[48px] text-[18px] font-semibold rounded-md transition-colors duration-300 ${
            isFormValid()
              ? "!bg-brand-primary-500 !text-white hover:!bg-brand-primary-600"
              : "!bg-brand-gray-200 !text-brand-gray-600"
          }`}
        >
          회원가입
        </button>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-4 text-center text-sm text-[#F66555]">{error}</p>
        )}
      </form>
    </div>
  );
};
