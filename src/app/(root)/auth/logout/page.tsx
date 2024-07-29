"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function LogoutPage() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout", {
        method: "DELETE",
      });

      clearUser();
      router.replace("/");
    };

    logout();
  }, [clearUser, router]);

  return <p>로그아웃 중...</p>;
}

// method : post가 아닌 delete로 변경
