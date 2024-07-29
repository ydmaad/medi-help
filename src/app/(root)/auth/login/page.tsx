"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        router.replace("/");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      setError("로그인 중 문제가 발생했습니다.");
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
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            아이디(이메일 주소)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디(이메일 주소)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "로딩 중..." : "로그인"}
        </button>
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember">아이디 기억하기</label>
          </div>
          <div>
            <a href="#" className="text-sm text-gray-600">
              아이디 찾기
            </a>
            <span className="mx-1 text-gray-400">|</span>
            <a href="#" className="text-sm text-gray-600">
              비밀번호 찾기
            </a>
          </div>
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-600">간편로그인</span>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="w-full bg-white text-black border border-gray-300 py-2 rounded-md flex items-center justify-center mr-2"
          >
            {/* <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" /> */}
            구글 로그인
          </button>
          <button
            type="button"
            className="w-full bg-yellow-500 text-black py-2 rounded-md flex items-center justify-center"
          >
            {/* <img src="/kakao-icon.svg" alt="Kakao" className="w-5 h-5 mr-2" /> */}
            카카오 로그인
          </button>
        </div>
        <div className="text-center mt-4">
          <a href="/auth/signup" className="text-sm text-gray-600">
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}
