// src/app/auth/complete/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth"; // useAuthStore import 추가
import { supabase } from "@/utils/supabase/client"; // supabase client import 추가

const SignupSuccess: React.FC = () => {
  const router = useRouter();
  // useAuthStore에서 필요한 함수와 상태를 가져옵니다.
  const { setIsLogedIn, user } = useAuthStore();

  // 홈으로 버튼 클릭 핸들러
  const handleHomeClick = async () => {
    //   if (user) {
    //     // 현재 세션이 유효한지 확인합니다.
    //     const { data, error } = await supabase.auth.getSession();
    //     if (data.session) {
    //       // 유효한 세션이 있으면 로그인 상태를 true로 설정합니다.
    //       setIsLogedIn(true);
    //     }
    //   }
    // 홈 페이지로 이동합니다.
    router.push("/");
  };

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = () => {
    // 로그인 페이지로 이동합니다.
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
        <h1 className="text-[26px] desktop:text-[28px] font-semibold text-brand-gray-800 mb-[40px]">
          회원가입이 완료되었습니다.
        </h1>
        <div className="flex justify-between">
          <button
            onClick={handleHomeClick} // 수정된 부분
            className="w-[156px] h-[48px] mr-[24px] text-[18px] font-semibold rounded
                       bg-brand-primary-50 text-brand-primary-500
                       hover:bg-brand-primary-100 transition-colors duration-300"
          >
            홈으로
          </button>
          <button
            onClick={handleLoginClick} // 수정된 부분
            className="w-[204px] h-[48px] text-[18px] font-semibold rounded
                       bg-brand-primary-500 text-white
                       hover:bg-brand-primary-600 transition-colors duration-300"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;

// 기존코드
// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";

// const SignupSuccess: React.FC = () => {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
//         <h1 className="text-[26px] desktop:text-[28px] font-semibold text-brand-gray-800 mb-[40px]">
//           회원가입이 완료되었습니다.
//         </h1>
//         <div className="flex justify-between">
//           <button
//             onClick={() => router.push("/")}
//             className="w-[156px] h-[48px] mr-[24px] text-[18px] font-semibold rounded
//                        bg-brand-primary-50 text-brand-primary-500
//                        hover:bg-brand-primary-100 transition-colors duration-300"
//           >
//             홈으로
//           </button>
//           <button
//             onClick={() => router.push("/auth/login")}
//             className="w-[204px] h-[48px] text-[18px] font-semibold rounded
//                        bg-brand-primary-500 text-white
//                        hover:bg-brand-primary-600 transition-colors duration-300"
//           >
//             로그인
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupSuccess;
