"use client";

import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRef } from "react";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthStore();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 스키마의 user 정보를 불러오는 로직. try-catch문으로 변경하기
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      alert(authError.message);
      return;
    }

    // auth스키마의 user테이블의 id 바탕으로 public 스키마의 user테이블에서 유저정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      console.error("User data fetch error:", userError);
      alert("사용자 정보를 가져오는 데 실패했습니다.");
      return;
    }

    // userData를 store에 저장(주스탠드)
    setUser(userData);

    // 1. supabase getUser정보 불러오기 (auth스키마)
    // 2. auth스키마의 user테이블의 id 바탕으로 public 스키마의 user테이블에서 유저정보 가져오기
    // 3. 주스탠드 유저정보 저장해놓을 store 만들기
    // 4. 1번에서 불러온 정보 넣어주기
    // 문제점 ? 로그인했을때 주스탠드 넣어주는 로직이다보니 다른페이지 가서 새로고침 됨. 주스탠드 스토어 날라감
    // 해결점 ? * 공용컴포넌트 있으면 어떤 페이지에서든 사용할 수 있음
    //           ex.헤더 컴포넌트 렌더링 될때마다 최초에 1~4번 로직 무조건 1번씩 실행시켜주기
    //           주스탠드 전역상태 관리에서 로그인 안되었을 경우
    //         * 공용컴포넌트 없으면 1~4번 로직 훅으로 만들기
    //           - 새로고침시 로그인 유지, 로그인 정보 필요할시 최상단에서 훅 실행
    //           - 실행되는 컴포넌트 최초 1번은 1~4번 로직 실행되어 전역상태 관리가 됨

    // router.replace("/");
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
