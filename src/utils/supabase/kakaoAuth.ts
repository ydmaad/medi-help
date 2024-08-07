// src/utils/auth/kakaoAuth.ts

import { supabase } from "../supabase/client";

export const signInWithKakao = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
  });

  if (error) throw error;
  return data;
};
