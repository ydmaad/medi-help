// header 테스트용으로 추가(로그인, 회원가입 관련)

"use client";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await createClient().auth.signOut();
  };

  return (
    <div className="p-2 flex justify-between items-center gap-x-2">
      <Link href="/">Home</Link>
      <div className="flex items-center gap-x-2">
        {user ? (
          <>
            <div>{user.email}</div>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link href="/auth/login">로그인</Link>
            <Link href="/auth/signup">회원가입</Link>
          </>
        )}
      </div>
    </div>
  );
}
