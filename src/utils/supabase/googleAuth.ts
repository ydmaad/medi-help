// src/utils/supabase/googleAuth.ts

import { supabase } from "./client";

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
      },
    });

    if (error) throw error;

    // 성공적으로 리다이렉트되면 여기까지 실행되지 않습니다.
    console.log("Google sign-in initiated:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return { data: null, error };
  }
};
