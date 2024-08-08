// src/utils/auth/kakaoAuth.ts

import { supabase } from "./client";

export const signInWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
};

// 기존 코드
// import { supabase } from "../supabase/client";

// export const signInWithKakao = async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "kakao",
//   });

//   if (error) throw error;
//   return data;
// };
