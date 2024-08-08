// src/components/molecules/header.tsx

"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import LoginNav from "./LoginNav";
import Navigation from "./navigation";
import Logo from "../atoms/Logo";

const Header = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const checkAndSetUser = async () => {
      if (!user) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            const {
              data: { user: authUser },
            } = await supabase.auth.getUser();
            if (authUser) {
              // users 테이블에서 닉네임을 가져옵니다.
              const { data: userData, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single();

              if (error) {
                console.error("Error fetching user data:", error);
                return;
              }

              if (userData) {
                // 닉네임이 없으면 이메일의 @ 앞 부분을 사용합니다.
                const nickname =
                  userData.nickname || authUser.email?.split("@")[0] || "User";
                setUser({ ...userData, nickname });
              }
            }
          }
        } catch (error) {
          console.error("Error checking user authentication:", error);
        }
      }
    };

    checkAndSetUser();
  }, []);

  return (
    <header className="flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px]">
      <Logo />
      <Navigation />
      <LoginNav />
    </header>
  );
};

export default Header;

// 기존 코드
// "use client";

// import React, { useEffect } from "react";
// import { useAuthStore } from "@/store/auth";
// import { supabase } from "@/utils/supabase/client";
// import LoginNav from "./LoginNav";
// import Navigation from "./navigation";
// import Logo from "../atoms/Logo";

// const Header = () => {
//   // 주스탠드 스토어에서 user 정보와 setUser 함수를 가져옴
//   const { user, setUser } = useAuthStore();

//   useEffect(() => {
//     // 사용자 인증 상태를 확인하고 설정하는 비동기 함수
//     const checkAndSetUser = async () => {
//       // 현재 user 정보가 없을 경우에만 실행
//       if (!user) {
//         try {
//           // Supabase에서 현재 인증된 사용자 정보를 가져옴
//           const {
//             data: { user: authUser },
//           } = await supabase.auth.getUser();

//           // 인증된 사용자가 있을 경우
//           if (authUser) {
//             // users 테이블에서 해당 사용자의 상세 정보를 가져옴
//             const { data: userData, error } = await supabase
//               .from("users")
//               .select("*")
//               .eq("id", authUser.id)
//               .single();

//             if (error) {
//               console.error("Error fetching user data:", error);
//               return;
//             }

//             // 사용자 데이터가 존재하면 주스탠드 스토어에 저장
//             if (userData) {
//               setUser(userData);
//             }
//           }
//         } catch (error) {
//           console.error("Error checking user authentication:", error);
//         }
//       }
//     };

//     // 컴포넌트 마운트 시 사용자 인증 상태를 확인(빈 의존성 배열로 컴포넌트 마운트 시 한번만 실행)
//     checkAndSetUser();
//   }, []);

//   return (
//     <header className="flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px]">
//       <Logo />
//       <Navigation />
//       <LoginNav />
//     </header>
//   );
// };

// export default Header;
