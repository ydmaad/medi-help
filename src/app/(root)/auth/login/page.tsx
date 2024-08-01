"use client";

import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) throw userError;

      setUser(userData);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("이메일, 비밀번호를 다시 입력해 주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Google 로그인 로직 구현
    alert("Google 로그인 기능은 아직 구현되지 않았습니다.");
  };

  const handleKakaoLogin = async () => {
    // TODO: Kakao 로그인 로직 구현
    alert("Kakao 로그인 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <button
            type="submit"
            className="w-full bg-brand-primary-500 text-white py-2 rounded-md"
          >
            로그인
          </button>
        </form>
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
