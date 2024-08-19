// src/components/molecules/LoginNav.tsx

"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import TextButton from "../atoms/Textbutton";
import { useRouter } from "next/navigation";
import ImageButton from "../atoms/ImageButton";

const LoginNav: React.FC = () => {
  // isLogedIn 상태를 추가로 가져옵니다.
  const { user, clearAuth, isLogedIn, setIsLogedIn } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      // 로그아웃 시 isLogedIn을 false로 설정
      setIsLogedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // isLogedIn 상태를 기반으로 UI를 결정합니다.
  if (isLogedIn && user) {
    return (
      <div className="flex items-center space-x-4 ">
        <ImageButton src="/ring.svg" alt="알림" href="/mypage" />
        <TextButton
          text={`${user.nickname || user.email?.split("@")[0] || "User"}님`}
          href="/mypage"
          className="text-brand-primary-500"
        />
        <div onClick={handleLogout}>
          <TextButton text="로그아웃" href="#" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-start">
        <TextButton text="로그인" href="/auth/login" />
      </div>
    );
  }
};

export default LoginNav;

// 기존 코드
// "use client";

// import React from "react";
// import { useAuthStore } from "@/store/auth";
// import { supabase } from "@/utils/supabase/client";
// import TextButton from "../atoms/Textbutton";
// import { useRouter } from "next/navigation";
// import ImageButton from "../atoms/ImageButton";

// const LoginNav: React.FC = () => {
//   const { user, clearAuth } = useAuthStore();
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       // Supabase를 통해 로그아웃 처리
//       await supabase.auth.signOut();
//       // 전역 상태의 사용자 정보 초기화
//       clearAuth();
//       // 홈페이지로 리다이렉트
//       router.push("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const getEmailUsername = (email: string) => {
//     return email.split("@")[0];
//   };

//   if (user) {
//     return (
//       <div className="flex items-center space-x-4 ">
//         <ImageButton src="/ring.svg" alt="알림" href="/mypage" />
//         <TextButton
//           text={`${user.nickname || user.email?.split("@")[0] || "User"}님`}
//           href="/mypage"
//           className="text-brand-primary-500"
//         />
//         <div onClick={handleLogout}>
//           <TextButton text="로그아웃" href="#" />
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <div className="flex items-center justify-start">
//         <TextButton text="로그인" href="/auth/login" />
//       </div>
//     );
//   }
// };

// export default LoginNav;
