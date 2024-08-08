// 목적: 회원가입 페이지의 최상위 컴포넌트
// src/app/(root)/auth/signup/page.tsx

"use client";

import React, { useState } from "react";
import { useAuthStore, AuthUser } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/templates/auth/SignupForm";

export default function SignupPage() {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  // 회원가입 처리 함수
  const handleSignup = async ({
    nickname,
    email,
    password,
    agreeTerms,
    agreePrivacy,
  }: {
    nickname: string;
    email: string;
    password: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => {
    try {
      // 약관 동의 확인
      if (!agreeTerms || !agreePrivacy) {
        throw new Error("이용약관과 개인정보 처리방침에 동의해주세요.");
      }

      // Supabase를 통한 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: nickname,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // 사용자 추가 정보를 데이터베이스에 저장
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email,
            nickname,
          },
        ]);

        if (insertError) throw insertError;

        // 저장된 사용자 정보 조회
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (fetchError) throw fetchError;

        // 전역 상태에 사용자 정보 저장
        setUser(userData as AuthUser);

        // 회원가입 성공 시 메인 페이지로 이동
        router.push("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignupForm onSubmit={handleSignup} error={error} />
    </div>
  );
}

// 기존 로직
// "use client";

// import { supabase } from "@/utils/supabase/client";
// // import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function SignUpPage() {
//   // 상태 관리를 위한 useState 훅 사용
//   const [nickname, setNickname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreePrivacy, setAgreePrivacy] = useState(false);
//   const [validationStatus, setValidationStatus] = useState({
//     nickname: "",
//     email: "",
//     password: "",
//     passwordConfirm: "",
//   });

//   const router = useRouter();

//   // 닉네임 유효성 검사 함수
//   const validateNickname = (value: string) => {
//     if (value.length >= 2 && value.length <= 6) {
//       setValidationStatus((prev) => ({ ...prev, nickname: "success" }));
//     } else {
//       setValidationStatus((prev) => ({ ...prev, nickname: "error" }));
//     }
//   };

//   // 이메일 유효성 검사 함수
//   const validateEmail = async (value: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (emailRegex.test(value)) {
//       // TODO: 실제 서버에 중복 확인 요청을 보내야 함
//       setValidationStatus((prev) => ({ ...prev, email: "success" }));
//     } else {
//       setValidationStatus((prev) => ({ ...prev, email: "error" }));
//     }
//   };

//   // 비밀번호 유효성 검사 함수
//   const validatePassword = (value: string) => {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
//     if (passwordRegex.test(value)) {
//       setValidationStatus((prev) => ({ ...prev, password: "success" }));
//     } else {
//       setValidationStatus((prev) => ({ ...prev, password: "error" }));
//     }
//   };

//   // 비밀번호 확인 유효성 검사 함수
//   const validatePasswordConfirm = (value: string) => {
//     if (value === password && value !== "") {
//       setValidationStatus((prev) => ({ ...prev, passwordConfirm: "success" }));
//     } else {
//       setValidationStatus((prev) => ({ ...prev, passwordConfirm: "error" }));
//     }
//   };

//   // 폼 제출 처리 함수
//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // 모든 필드가 입력되었는지 확인
//     if (
//       nickname === "" ||
//       email === "" ||
//       password === "" ||
//       passwordConfirm === ""
//     ) {
//       alert("모든 항목을 입력해주세요.");
//       return;
//     }

//     // 비밀번호 일치 여부 확인
//     if (password !== passwordConfirm) {
//       setValidationStatus((prev) => ({ ...prev, passwordConfirm: "error" }));
//       return;
//     }

//     // 약관 동의 여부 확인
//     if (!agreeTerms || !agreePrivacy) {
//       alert("이용약관과 개인정보처리방침에 동의해주세요.");
//       return;
//     }

//     try {
//       // Supabase를 사용하여 회원가입 처리
//       const { data: signUpData, error: signUpError } =
//         await supabase.auth.signUp({
//           email,
//           password,
//         });

//       if (signUpError) {
//         throw signUpError;
//       }

//       if (signUpData.user) {
//         // 사용자 추가 정보를 데이터베이스에 저장
//         const { error: insertError } = await supabase.from("users").insert([
//           {
//             id: signUpData.user.id,
//             email,
//             nickname,
//             avatar: "",
//           },
//         ]);

//         if (insertError) {
//           throw insertError;
//         }

//         alert("회원가입이 완료되었습니다.");
//         router.replace("/auth/login"); // 로그인 페이지로 리다이렉트
//       }
//     } catch (error: any) {
//       console.error("회원가입 중 에러 발생:", error);
//       alert(error.message || "회원가입 중 문제가 발생했습니다.");
//     }
//   };

//   // UI 렌더링
//   return (
//     <form
//       onSubmit={onSubmit}
//       className="flex flex-col gap-y-4 w-96 mx-auto mt-8"
//     >
//       <h1 className="text-2xl font-bold text-center mb-4">회원 가입</h1>

//       {/* 닉네임 입력 필드 */}
//       <div className="flex flex-col">
//         <label htmlFor="nickname">닉네임</label>
//         <input
//           type="text"
//           id="nickname"
//           value={nickname}
//           onChange={(e) => {
//             setNickname(e.target.value);
//             validateNickname(e.target.value);
//           }}
//           placeholder="닉네임 설정"
//           className={`border p-2 rounded ${
//             validationStatus.nickname === "error" ? "border-red-500" : ""
//           }`}
//         />
//         {validationStatus.nickname === "success" && (
//           <p className="text-green-500 mt-1">사용할 수 있는 닉네임입니다.</p>
//         )}
//         {validationStatus.nickname === "error" && (
//           <p className="text-red-500 mt-1">닉네임은 2~6자 사이여야 합니다.</p>
//         )}
//       </div>

//       {/* 이메일 입력 필드 */}
//       <div className="flex flex-col">
//         <label htmlFor="email">이메일 입력</label>
//         <div className="flex">
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               validateEmail(e.target.value);
//             }}
//             placeholder="example@도메인.com"
//             className={`border p-2 rounded flex-grow ${
//               validationStatus.email === "error" ? "border-red-500" : ""
//             }`}
//           />
//           <button
//             type="button"
//             onClick={() => validateEmail(email)}
//             className="ml-2 bg-brand-gray-50 text-brand-gray-600 px-4 py-2 rounded"
//           >
//             중복확인
//           </button>
//         </div>
//         {validationStatus.email === "success" && (
//           <p className="text-green-500 mt-1">사용할 수 있는 이메일입니다.</p>
//         )}
//         {validationStatus.email === "error" && (
//           <p className="text-red-500 mt-1">올바른 이메일 형식이 아닙니다.</p>
//         )}
//       </div>

//       {/* 비밀번호 입력 필드 */}
//       <div className="flex flex-col">
//         <label htmlFor="password">비밀번호 입력</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => {
//             setPassword(e.target.value);
//             validatePassword(e.target.value);
//           }}
//           placeholder="비밀번호를 입력해 주세요."
//           className={`border p-2 rounded ${
//             validationStatus.password === "error" ? "border-red-500" : ""
//           }`}
//         />
//         {validationStatus.password === "error" && (
//           <p className="text-red-500 mt-1">
//             비밀번호는 알파벳 대,소문자, 숫자, 특수문자를 포함하여 8자
//             이상이어야 합니다.
//           </p>
//         )}
//       </div>

//       {/* 비밀번호 확인 필드 */}
//       <div className="flex flex-col">
//         <label htmlFor="passwordConfirm">비밀번호 확인</label>
//         <input
//           type="password"
//           id="passwordConfirm"
//           value={passwordConfirm}
//           onChange={(e) => {
//             setPasswordConfirm(e.target.value);
//             validatePasswordConfirm(e.target.value);
//           }}
//           placeholder="다시 한번 입력해 주세요."
//           className={`border p-2 rounded ${
//             validationStatus.passwordConfirm === "error" ? "border-red-500" : ""
//           }`}
//         />
//         {validationStatus.passwordConfirm === "error" &&
//           passwordConfirm !== "" && (
//             <p className="text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
//           )}
//       </div>

//       {/* 약관 동의 체크박스 */}
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           id="agreeTerms"
//           checked={agreeTerms}
//           onChange={(e) => setAgreeTerms(e.target.checked)}
//           className="mr-2"
//         />
//         <label htmlFor="agreeTerms" className="text-sm">
//           개인정보처리방침 약관 동의 (필수)
//         </label>
//       </div>

//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           id="agreePrivacy"
//           checked={agreePrivacy}
//           onChange={(e) => setAgreePrivacy(e.target.checked)}
//           className="mr-2"
//         />
//         <label htmlFor="agreePrivacy" className="text-sm">
//           메디헬프 서비스 이용약관 동의 (필수)
//         </label>
//       </div>

//       {/* 회원가입 버튼 */}
//       <button
//         type="submit"
//         className="bg-brand-primary-500 text-white p-2 rounded mt-4"
//         disabled={
//           validationStatus.nickname !== "success" ||
//           validationStatus.email !== "success" ||
//           validationStatus.password !== "success" ||
//           validationStatus.passwordConfirm !== "success" ||
//           !agreeTerms ||
//           !agreePrivacy
//         }
//       >
//         회원가입
//       </button>
//     </form>
//   );
// }
