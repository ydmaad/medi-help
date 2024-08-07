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
