"use client";

import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 스키마의 user 정보를 불러오는 로직
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

      if (authError) throw authError;

      // auth 스키마의 user테이블의 id 바탕으로 public 스키마의 user 테이블에서 유저정보 가져오기
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) throw userError;

      // userData를 store에 저장(주스탠드)
      setUser(userData);

      // 로그인 성공 후 메인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-y-2 border-2 w-96 items-center"
    >
      <div className="w-full flex items-center justify-between p-4">
        <label htmlFor="email" className="mr-2">
          이메일
        </label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          placeholder="이메일을 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      <div className="w-full flex items-center justify-between p-4">
        <label htmlFor="password" className="mr-2">
          비밀번호
        </label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      <div className="w-full p-4 flex flex-col gap-y-2">
        <button className="w-full bg-blue-500 text-white p-2 rounded-md">
          로그인
        </button>
        <Link href="/auth/signup">
          <button
            type="button"
            className="w-full bg-black text-white p-2 rounded-md"
          >
            회원가입 가기
          </button>
        </Link>
      </div>
    </form>
  );
}
