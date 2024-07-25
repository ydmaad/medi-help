"use client";

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState({
    password: "",
    passwordConfirm: "",
  });

  const router = useRouter();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setError({
        ...error,
        password: "비밀번호는 최소 6자 이상입니다.",
      });
    } else {
      setError({
        ...error,
        password: "",
      });
    }
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (e.target.value.length < 6) {
      setError({
        ...error,
        passwordConfirm: "비밀번호 확인은 최소 6자 이상입니다.",
      });
    } else {
      setError({
        ...error,
        passwordConfirm: "",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" || password === "" || passwordConfirm === "") {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return alert(error.message);
    }
    const { data: users, error: insertError } = await supabase
      .from("users")
      .insert({ email });
    // console.log(users, insertError);

    alert("회원가입이 완료되었습니다.");
    // router.push("/")
    // router.replace("/"); // 뒤로가기 시 회원가입 페이지로 이동 X
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
          type="email"
          id="email"
          value={email}
          onChange={onChangeEmail}
          placeholder="이메일을 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      <div className="w-full flex items-center justify-between p-4">
        <label htmlFor="password" className="mr-2">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={onChangePassword}
          placeholder="비밀번호를 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      {error.password && <p className="text-red-500">{error.password}</p>}
      <div className="w-full flex items-center justify-between p-4">
        <label htmlFor="passwordConfirm" className="mr-2">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={onChangePasswordConfirm}
          placeholder="이메일을 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      {error.passwordConfirm && (
        <p className="text-red-500">{error.passwordConfirm}</p>
      )}
      <div className="w-full p-4 flex flex-col gap-y-2">
        <button className="w-full bg-blue-500 text-white p-2 rounded-md">
          회원가입
        </button>
        <Link href="/auth/login">
          <button
            type="button"
            className="w-full bg-black text-white p-2 rounded-md"
          >
            로그인하러 가기
          </button>
        </Link>
      </div>
    </form>
  );
}
