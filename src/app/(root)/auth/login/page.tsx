"use client";

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/");
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
