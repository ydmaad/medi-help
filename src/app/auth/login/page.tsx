"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        alert(data.error);
      }
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      alert("로그인 중 문제가 발생했습니다.");
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요."
          className="border-2 border-gray-300 rounded-md p-1"
        />
      </div>
      <div className="w-full p-4 flex flex-col gap-y-2">
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "로딩 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
}
