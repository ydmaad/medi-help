import { supabase } from "@/utils/supabase/client";
import React from "react";

export default async function AuthPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("유저", user);

  return (
    <div>
      <h1>Auth Page</h1>
    </div>
  );
}

// "use client";
// import { supabase } from "@/utils/supabase/client";
// import React from "react";

// export default function page() {
//   const signInWithKakao = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "kakao",
//     });
//     return data;
//   };
//   const onClick = () => {
//     const data = signInWithKakao();
//     console.log(data);
//   };

//   return (
//     <div>
//       <button onClick={onClick}>클릭</button>
//     </div>
//   );
// }
// 카카오 로그인 테스트
