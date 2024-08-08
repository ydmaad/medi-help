// src/components/molecules/LoginNav.tsx
"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import TextButton from "../atoms/Textbutton";
import { useRouter } from "next/navigation";

const LoginNav: React.FC = () => {
  // 주스탠드 스토어에서 user 정보와 clearAuth 함수를 가져옴
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  // 로그아웃 처리 함수 (Supabase를 통해 서버 측 로그아웃을 수행 / 주스탠드 스토어의 유저 정보를 초기화 / 로그아웃 후 홈페이지로 리다이렉트)
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // 여기에 에러 처리 로직 추가예정 (예: 사용자에게 알림)
    }
  };

  // 이메일에서 사용자 이름만 추출하는 함수
  // const getEmailUsername = (email: string) => {
  //   return email.split("@")[0];
  // };

  // 사용자가 로그인한 경우의 UI
  if (user) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {/* 알림 버튼 */}
        <TextButton text="알림" href="/mypage" />
        {/* 사용자 이름 표시 */}
        {/* 닉네임으로 표시 */}
        <TextButton text={`${user.nickname || "User"}님`} href="/mypage" />
        {/* 로그아웃 버튼 
            TextButton은 href prop을 필요로 하므로 "#"를 전달하고,
            실제 로그아웃 동작은 상위 div의 onClick 이벤트로 처리 */}
        <div onClick={handleLogout}>
          <TextButton text="로그아웃" href="#" />
        </div>
      </div>
    );
  } else {
    // 사용자가 로그아웃한 경우의 UI
    return (
      <div className="grid grid-cols-1">
        {/* 로그인 버튼 */}
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
