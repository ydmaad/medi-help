"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<{ [key: string]: string }>({
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "비밀번호는 최소 6자 이상입니다.",
      }));
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (e.target.value.length < 6) {
      setError((prev) => ({
        ...prev,
        passwordConfirm: "비밀번호 확인은 최소 6자 이상입니다.",
      }));
    } else {
      setError((prev) => ({ ...prev, passwordConfirm: "" }));
    }
  };

  const onChangeNickname = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    if (value.trim() === "") {
      setError((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
      return;
    }

    const response = await fetch("/api/auth/check-nickname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: value }),
    });

    const data = await response.json();
    if (data.exists) {
      setError((prev) => ({
        ...prev,
        nickname: "이미 사용 중인 닉네임입니다.",
      }));
    } else {
      setError((prev) => ({ ...prev, nickname: "" }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      email === "" ||
      password === "" ||
      passwordConfirm === "" ||
      nickname === ""
    ) {
      alert("모든 항목을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (error.nickname !== "") {
      alert("닉네임을 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");
        router.replace("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
      alert("회원가입 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
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
          type="email"
          id="email"
          value={email}
          onChange={onChangeEmail}
          placeholder="이메일을 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      <div className="w-full flex items-center justify-between p-4">
        <label htmlFor="nickname" className="mr-2">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={onChangeNickname}
          placeholder="닉네임을 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      {error.nickname && <p className="text-red-500">{error.nickname}</p>}
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
          placeholder="비밀번호를 다시 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      {error.passwordConfirm && (
        <p className="text-red-500">{error.passwordConfirm}</p>
      )}
      <div className="w-full p-4 flex flex-col gap-y-2">
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "로딩 중..." : "회원가입"}
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
