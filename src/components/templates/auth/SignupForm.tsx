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

  // 이메일 중복 확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

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

  // 이메일 중복 확인 핸들러
  const handleEmailCheck = async () => {
    if (!email || !emailValid) {
      alert("유효한 이메일을 입력해주세요.");
      return;
    }

    const isAvailable = await checkEmail(email);
    setIsEmailChecked(true);
    setIsEmailAvailable(isAvailable);

    if (isAvailable) {
      alert("사용 가능한 이메일입니다.");
    } else {
      alert("이미 사용 중인 이메일입니다.");
    }
  };

  // 이메일 변경 시 중복 확인 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  }, [email]);

  // 닉네임 유효성 검사
  useEffect(() => {
    if (nickname !== "") {
      setNicknameValid(nickname.length >= 2 && nickname.length <= 6);
    } else {
      setNicknameValid(null);
    }
  }, [nickname]);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let errors = [];
    if (!nicknameValid) errors.push("닉네임을 확인해주세요.");
    if (!emailValid || !isEmailChecked || !isEmailAvailable)
      errors.push("이메일을 확인해주세요.");
    if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
    if (!passwordConfirmValid)
      errors.push("비밀번호 확인이 일치하지 않습니다.");
    if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

    if (errors.length > 0) {
      alert(errors.join("\n"));
    } else {
      onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
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
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 설정"
            className="w-full px-3 py-2"
            isValid={nicknameValid !== false}
          />
          {nicknameValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              사용할 수 없는 닉네임입니다.
            </p>
          )}
          {nicknameValid === true && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              사용할 수 있는 닉네임입니다.
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
              name="nickname"
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
                isActive={emailValid !== true}
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
        <AuthButton type="submit" className="w-full text-[18px]">
          회원가입
        </AuthButton>
      </form>
    </div>
  );
};
