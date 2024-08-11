// 목적: 회원가입 폼의 전체 구조와 로직을 관리하는 컴포넌트
// src/components/templates/auth/SignupForm.tsx

import React, { useState, useEffect } from "react";
import { AuthInput } from "../../atoms/AuthInput";
import { AuthButton } from "../../atoms/AuthButton";
import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
import { AuthCheckbox } from "../../molecules/AuthCheckbox";

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
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setPasswordValid(passwordRegex.test(password));
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
    if (
      nicknameValid &&
      emailValid &&
      passwordValid &&
      passwordConfirmValid &&
      agreeTerms &&
      agreePrivacy
    ) {
      onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">회원 가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 닉네임 입력 필드 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            닉네임
          </label>
          <AuthInput
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 설정"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {nicknameValid === false && (
            <p className="text-red-500 text-sm mt-1">
              사용할 수 없는 닉네임입니다.
            </p>
          )}
          {nicknameValid === true && (
            <p className="text-green-500 text-sm mt-1">
              사용할 수 있는 닉네임입니다.
            </p>
          )}
        </div>

        {/* 이메일 입력 필드 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이메일 입력
          </label>
          <div className="flex items-center">
            <AuthInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@도메인.com"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
            />
            {/* <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-r-md h-[42px]"
            >
              중복확인
            </button> */}
          </div>
          {emailValid === false && (
            <p className="text-red-500 text-sm mt-1">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}
          {emailValid === true && (
            <p className="text-green-500 text-xs mt-1">
              사용할 수 있는 이메일입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호 입력
          </label>
          <AuthPasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
          />
          {passwordValid === false && (
            <p className="text-red-500 text-sm mt-1">
              비밀번호는 알파벳 대,소문자,숫자,특수문자를 포함하여 8자
              이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호 확인
          </label>
          <AuthPasswordInput
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="다시 한번 입력해 주세요."
          />
          {passwordConfirmValid === false && (
            <p className="text-red-500 text-sm mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          {passwordConfirmValid === true && (
            <p className="text-green-500 text-sm mt-1">
              비밀번호가 일치합니다.
            </p>
          )}
        </div>

        {/* 약관 동의 체크박스 */}
        <AuthCheckbox
          id="agreeTerms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          label="개인정보처리방침 약관 동의 (필수)"
        />
        <AuthCheckbox
          id="agreePrivacy"
          checked={agreePrivacy}
          onChange={(e) => setAgreePrivacy(e.target.checked)}
          label="메디헬프 서비스 이용약관 동의 (필수)"
        />

        {/* 에러 메시지 */}
        {error && <AuthErrorMessage message={error} />}

        {/* 회원가입 버튼 */}
        <AuthButton
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          회원가입
        </AuthButton>
      </form>
    </div>
  );
};
