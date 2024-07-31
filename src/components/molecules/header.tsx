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
            data: { user: authUser },
          } = await supabase.auth.getUser();

          if (authUser) {
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
              setUser(userData);
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

// "use client";

// import React, { useEffect } from "react";
// import { useAuthStore } from "@/store/auth";
// import { supabase } from "@/utils/supabase/client";
// import LoginNav from "./LoginNav";
// import Navigation from "./navigation";
// import Logo from "../atoms/Logo";

// const Header = () => {
//   const { user, setUser, clearAuth } = useAuthStore();

//   // 전역 관리 로직
//   // 1. 주스탠드 안에서 유저정보 없을시 1~4번 로직 최초 1번 실행
//   // 2. 로그아웃때는 주스탠드 안에서 유저정보 날리기 (로그아웃 버튼)
//   useEffect(() => {
//     const checkAndSetUser = async () => {
//       if (!user) {
//         const {
//           data: { user: authUser },
//         } = await supabase.auth.getUser();

//         if (authUser) {
//           const { data: userData, error } = await supabase
//             .from("users")
//             .select("*")
//             .eq("id", authUser.id)
//             .single();

//           if (error) {
//             console.error("Error fetching user data:", error);
//             return;
//           }

//           if (userData) {
//             setUser(userData);
//           }
//         }
//       }
//     };

//     checkAndSetUser();
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     clearAuth();
//   };

//   return (
//     <header className="flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px]">
//       <Logo />
//       <Navigation />
//       {/* onLogout 내에서만 함수만들고 실행하도록. props보다는. 상태관리측면 */}
//       <LoginNav onLogout={handleLogout} />
//     </header>
//   );
// };

// export default Header;
