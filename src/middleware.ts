import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "./utils/supabase/client";

// localStorage의 토큰 확인 후 supabase에 현재 user 확인 ->
export async function middleware(request: NextRequest) {
  const { data } = await supabase.auth.getUser();
  console.log(data); // { user: null }
}

export const config = {
  // TODO: 추후 수정 예정
  matcher: ["/", "/products/:path*"],
};

// 기존에 설정한 middleware 로직
// import { type NextRequest } from "next/server";
// import { updateSession } from "@/utils/supabase/middleware";

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };
