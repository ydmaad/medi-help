"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);

  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(e.target.value.length >= 8);
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    setError((prev) => ({
      ...prev,
      passwordConfirm:
        e.target.value !== password ? "비밀번호가 일치하지 않습니다." : "",
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (email === "" || password === "" || passwordConfirm === "") {
      alert("모든 항목을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError((prev) => ({
        ...prev,
        passwordConfirm: "비밀번호가 일치하지 않습니다.",
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        router.replace("/auth/signup/complete");
      } else {
        setError((prev) => ({
          ...prev,
          submit: data.error,
        }));
      }
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
      setError((prev) => ({
        ...prev,
        submit: "회원가입 중 문제가 발생했습니다.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">회원 가입</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            아이디 입력
          </label>
          <div className="flex">
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="텍스트 입력된 상태"
              className={`w-full px-3 py-2 border ${
                isEmailValid === false ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            <button
              type="button"
              className="ml-2 px-3 py-2 bg-gray-300 rounded-md text-gray-700"
            >
              중복확인
            </button>
          </div>
          {isEmailValid === false && (
            <p className="text-red-500 text-sm mt-1">
              사용할 수 없는 이메일입니다.
            </p>
          )}
          {isEmailValid === true && (
            <p className="text-green-500 text-sm mt-1">
              사용할 수 있는 이메일입니다.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            비밀번호 입력
          </label>
          <div className="flex">
            <input
              type="password"
              id="password"
              value={password}
              onChange={onChangePassword}
              placeholder="텍스트 입력된 상태"
              className={`w-full px-3 py-2 border ${
                isPasswordValid === false ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            <button
              type="button"
              className="ml-2 px-3 py-2 bg-gray-300 rounded-md text-gray-700"
            >
              보기
            </button>
          </div>
          {isPasswordValid === false && (
            <p className="text-red-500 text-sm mt-1">
              알파벳 대,소문자, 특수문자 포함 8자 이상
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block text-gray-700">
            비밀번호 확인
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={onChangePasswordConfirm}
            placeholder="텍스트 입력된 상태"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {error.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">{error.passwordConfirm}</p>
          )}
          {!error.passwordConfirm && passwordConfirm && (
            <p className="text-green-500 text-sm mt-1">
              비밀번호가 일치합니다.
            </p>
          )}
        </div>
        <div className="mb-4">
          <input type="checkbox" id="privacy" className="mr-2" />
          <label htmlFor="privacy" className="text-gray-700">
            개인정보처리방침 약관 동의 (필수)
          </label>
        </div>
        <div className="mb-4">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms" className="text-gray-700">
            메디헬프 서비스 이용약관 동의 (필수)
          </label>
        </div>
        {error.submit && (
          <p className="text-red-500 text-sm mb-4">{error.submit}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "로딩 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
