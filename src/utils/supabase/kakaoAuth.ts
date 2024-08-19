// src/utils/supabase/kakaoAuth.ts

import { supabase } from "./client";

export const signInWithKakao = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
      },
    });

    if (error) throw error;

    // 로그인 성공 후 사용자 정보 반환
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { user, error: null };
  } catch (error) {
    console.error("Error during Kakao sign-in:", error);
    return { user: null, error };
  }
};

// 기존 코드
// import { supabase } from "./client";

// export const signInWithKakao = async () => {
//   try {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "kakao",
//       options: {
//         redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
//       },
//     });

//     if (error) throw error;

//     // 성공적으로 리다이렉트되면 여기까지 실행되지 않습니다.
//     console.log("Kakao sign-in initiated:", data);
//   } catch (error) {
//     console.error("Error during Kakao sign-in:", error);
//     throw error;
//   }
// };
