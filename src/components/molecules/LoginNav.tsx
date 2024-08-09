// src/components/molecules/LoginNav.tsx

"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import TextButton from "../atoms/Textbutton";
import { useRouter } from "next/navigation";

const LoginNav: React.FC = () => {
  // 전역 상태에서 user와 clearAuth 함수를 가져옵니다.
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  // 현재 사용자 정보를 콘솔에 출력합니다 (디버깅용).
  console.log("Current user in LoginNav:", user);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // Supabase를 통해 로그아웃 처리
      await supabase.auth.signOut();
      // 전역 상태의 사용자 정보 초기화
      clearAuth();
      // 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 사용자가 로그인한 경우의 UI
  if (user) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <TextButton text="알림" href="/mypage" />
        {/* 닉네임 또는 이메일의 @ 앞부분을 표시 */}
        <TextButton
          text={`${user.nickname || user.email?.split("@")[0] || "User"}님`}
          href="/mypage"
        />
        {/* 로그아웃 버튼 */}
        <div onClick={handleLogout}>
          <TextButton text="로그아웃" href="#" />
        </div>
      </div>
    );
  } else {
    // 사용자가 로그인하지 않은 경우의 UI
    return (
      <div className="grid grid-cols-1">
        <TextButton text="로그인" href="/auth/login" />
      </div>
    );
  }
};

export default LoginNav;

// 원래 코드 추후 디자인 맞춰서 수정 예정
// "use client";
// import React from "react";
// import TextButton from "../atoms/Textbutton";

// const Navigation = () => {
//   return (
//     <div className="grid grid-cols-3 gap-2">
//       <TextButton text="알림" href="/mypage" />
//       <TextButton text="ㅇㅇㅇ님" href="/columns" />
//       {/*추후 수파베이스 연결 후 입력 바뀌게 설정할꺼임*/}
//       <TextButton text="로그아웃" href="/auth/login" />
//       {/*추후 수파베이스 연결 후 입력 바뀌게 설정할꺼임*/}
//     </div>
//   );
// };

// export default Navigation;
