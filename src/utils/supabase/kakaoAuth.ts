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

    // 성공적으로 리다이렉트되면 여기까지 실행되지 않습니다.
    console.log("Kakao sign-in initiated:", data);
  } catch (error) {
    console.error("Error during Kakao sign-in:", error);
    throw error;
  }
};
