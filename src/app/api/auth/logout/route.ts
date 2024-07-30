// ssr방식 미적용이라 라우트핸들러 주석처리

// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/utils/supabase/client";

// export async function POST(request: NextRequest) {
//   try {
//     const { error } = await supabase.auth.signOut();

//     if (error) {
//       throw error;
//     }

//     return NextResponse.json({ message: "로그아웃이 완료되었습니다." });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
