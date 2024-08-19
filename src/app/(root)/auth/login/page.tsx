// 목적: 로그인 페이지의 최상위 컴포넌트
// src/app/(root)/auth/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/templates/auth/LoginForm";
import { signInWithKakao } from "@/utils/supabase/kakaoAuth";
import { signInWithGoogle } from "@/utils/supabase/googleAuth";

export default function LoginPage() {
  const { setUser, setIsLogedIn } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return;
          }

          setUser(userData);
          setIsLogedIn(true);
          router.push("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsLogedIn, router]);

  // 이메일/비밀번호 로그인 핸들러
  const handleLogin = async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 이메일 기억하기 처리
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      const { error } = await signInWithKakao();
      if (error) throw error;
    } catch (error) {
      console.error("Kakao login error:", error);
      setError("카카오 로그인 중 오류가 발생했습니다.");
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      setError("구글 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm
        onSubmit={handleLogin}
        onKakaoLogin={handleKakaoLogin}
        onGoogleLogin={handleGoogleLogin}
        error={error}
      />
    </div>
  );
}

// 최신 코드
// "use client";

// import React, { useState } from "react";
// import { useAuthStore } from "@/store/auth";
// import { supabase } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { LoginForm } from "@/components/templates/auth/LoginForm";
// import { signInWithKakao } from "@/utils/supabase/kakaoAuth";
// import { signInWithGoogle } from "@/utils/supabase/googleAuth";

// export default function LoginPage() {
//   const { setUser, setIsLogedIn } = useAuthStore();
//   const router = useRouter();
//   const [error, setError] = useState<string>("");

//   // 이메일/비밀번호 로그인 핸들러
//   const handleLogin = async ({
//     email,
//     password,
//     rememberMe,
//   }: {
//     email: string;
//     password: string;
//     rememberMe: boolean;
//   }) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       if (data.user) {
//         // 사용자 정보 조회
//         const { data: userData, error: userError } = await supabase
//           .from("users")
//           .select("*")
//           .eq("id", data.user.id)
//           .single();

//         if (userError) throw userError;

//         // 전역 상태에 사용자 정보 저장
//         setUser(userData);
//         // 로그인 상태를 true로 설정
//         setIsLogedIn(true);

//         // 이메일 기억하기 처리
//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//         } else {
//           localStorage.removeItem("rememberedEmail");
//         }

//         // 로그인 성공 시 메인 페이지로 이동
//         router.push("/");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("이메일 또는 비밀번호가 올바르지 않습니다.");
//     }
//   };

//   // 카카오 로그인 핸들러
//   const handleKakaoLogin = async () => {
//     try {
//       const data = await signInWithKakao();
//       console.log("Kakao login success:", data);
//       // 로그인 상태를 true로 설정
//       setIsLogedIn(true);
//       // 카카오 로그인 후 메인 페이지로 이동
//       router.push("/");
//     } catch (error) {
//       console.error("Kakao login error:", error);
//       setError("카카오 로그인 중 오류가 발생했습니다.");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const data = await signInWithGoogle();
//       console.log("Google login success:", data);
//       // 로그인 상태를 true로 설정
//       setIsLogedIn(true);
//       // 구글 로그인 후 메인 페이지로 이동
//       router.push("/");
//     } catch (error) {
//       console.error("Google login error:", error);
//       setError("구글 로그인 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <LoginForm
//         onSubmit={handleLogin}
//         onKakaoLogin={handleKakaoLogin}
//         onGoogleLogin={handleGoogleLogin}
//         error={error}
//       />
//     </div>
//   );
// }

// 기존코드
// "use client";

// import React, { useState } from "react";
// import { useAuthStore } from "@/store/auth";
// import { supabase } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { LoginForm } from "@/components/templates/auth/LoginForm";
// import { signInWithKakao } from "@/utils/supabase/kakaoAuth";
// import { signInWithGoogle } from "@/utils/supabase/googleAuth";

// export default function LoginPage() {
//   const { setUser } = useAuthStore();
//   const router = useRouter();
//   const [error, setError] = useState<string>("");

//   // 이메일/비밀번호 로그인 핸들러
//   const handleLogin = async ({
//     email,
//     password,
//     rememberMe,
//   }: {
//     email: string;
//     password: string;
//     rememberMe: boolean;
//   }) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       if (data.user) {
//         // 사용자 정보 조회
//         const { data: userData, error: userError } = await supabase
//           .from("users")
//           .select("*")
//           .eq("id", data.user.id)
//           .single();

//         if (userError) throw userError;

//         // 전역 상태에 사용자 정보 저장
//         setUser(userData);

//         // 이메일 기억하기 처리
//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//         } else {
//           localStorage.removeItem("rememberedEmail");
//         }

//         // 로그인 성공 시 메인 페이지로 이동
//         router.push("/");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("이메일 또는 비밀번호가 올바르지 않습니다.");
//     }
//   };

//   // 카카오 로그인 핸들러
//   const handleKakaoLogin = async () => {
//     try {
//       const data = await signInWithKakao();
//       console.log("Kakao login success:", data);
//       // 카카오 로그인 후 메인 페이지로 이동
//       router.push("/");
//     } catch (error) {
//       console.error("Kakao login error:", error);
//       setError("카카오 로그인 중 오류가 발생했습니다.");
//     }
//   };

//   // 구글 로그인 핸들러
//   // const handleGoogleLogin = async () => {
//   //   alert("Google 로그인 기능은 아직 구현되지 않았습니다.");
//   // };

//   const handleGoogleLogin = async () => {
//     try {
//       const data = await signInWithGoogle();
//       console.log("Google login success:", data);
//       // 구글 로그인 후 메인 페이지로 이동
//       router.push("/");
//     } catch (error) {
//       console.error("Google login error:", error);
//       setError("구글 로그인 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <LoginForm
//         onSubmit={handleLogin}
//         onKakaoLogin={handleKakaoLogin}
//         onGoogleLogin={handleGoogleLogin}
//         error={error}
//       />
//     </div>
//   );
// }
