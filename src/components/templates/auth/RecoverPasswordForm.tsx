// src/components/templates/auth/RecoverPasswordForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { AuthPasswordInput } from "@/components/molecules/AuthPasswordInput";
import { useRouter } from "next/navigation";
import { PasswordChangedSuccess } from "./PasswordChangedSuccess";

export const RecoverPasswordForm: React.FC = () => {
  // 상태 관리
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const router = useRouter();

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    const handlePasswordReset = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setMessage("비밀번호를 재설정할 수 있습니다.");
      } else {
        setMessage(
          "유효하지 않은 접근입니다. 비밀번호 재설정 이메일을 다시 요청해 주세요."
        );
      }
      setIsLoading(false);
    };

    handlePasswordReset();
  }, []);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 6;
    setIsPasswordValid(
      hasLetter && hasNumber && hasSpecialChar && isLongEnough
    );
  }, [password]);

  // 비밀번호 확인 일치 여부 검사
  useEffect(() => {
    setIsConfirmPasswordValid(
      password === confirmPassword && confirmPassword !== ""
    );
  }, [password, confirmPassword]);

  // 비밀번호 재설정 핸들러
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !isConfirmPasswordValid) {
      setMessage("비밀번호가 유효하지 않거나 일치하지 않습니다.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // 비밀번호 변경 성공 시 상태 업데이트
      setIsPasswordChanged(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage("비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 비밀번호 변경 성공 시 새로운 컴포넌트 렌더링
  if (isPasswordChanged) {
    return <PasswordChangedSuccess />;
  }

  // 컴포넌트 렌더링
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[334px] desktop:w-[384px] max-w-md">
        <h1 className="text-[28px] font-bold text-center text-brand-gray-800 mb-[40px]">
          비밀번호 재설정
        </h1>
        {message !== "비밀번호를 재설정할 수 있습니다." ? (
          <p className="text-center">{message}</p>
        ) : (
          <form onSubmit={handleResetPassword}>
            {/* 새 비밀번호 입력 필드 */}
            <div className="mb-4">
              <AuthPasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
                isValid={isPasswordValid || password === ""}
              />
              {/* 비밀번호 유효성 검사 메시지 */}
              {!isPasswordValid && password && (
                <p className="text-[#F66555] text-[12px] mt-1">
                  영문자, 숫자, 특수문자 포함하여 최소 6자 이상이어야 합니다.
                </p>
              )}
            </div>
            {/* 비밀번호 확인 입력 필드 */}
            <div className="mb-4">
              <AuthPasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
                isValid={isConfirmPasswordValid || confirmPassword === ""}
              />
              {/* 비밀번호 불일치 메시지 */}
              {!isConfirmPasswordValid && confirmPassword && (
                <p className="text-[#F66555] text-[12px] mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
              {/* 비밀번호 일치 메시지 */}
              {isConfirmPasswordValid && confirmPassword && (
                <p className="text-[#00D37B] text-[12px] mt-1">
                  비밀번호가 일치합니다.
                </p>
              )}
            </div>
            {/* 비밀번호 변경 버튼 */}
            <button
              type="submit"
              className={`w-full h-[48px] text-[18px] font-semibold rounded-md transition-colors duration-300 ${
                isPasswordValid && isConfirmPasswordValid
                  ? "bg-brand-primary-500 text-white hover:bg-brand-primary-600"
                  : "bg-brand-gray-200 text-brand-gray-600"
              }`}
            >
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 기존 코드
// "use client";

// import React, { useState, useEffect } from "react";
// import { supabase } from "@/utils/supabase/client";
// import { AuthInput } from "@/components/atoms/AuthInput";
// import { AuthButton } from "@/components/atoms/AuthButton";
// import { useRouter } from "next/navigation";

// export const RecoverPasswordForm: React.FC = () => {
//   // 상태 관리
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // 컴포넌트 마운트 시 세션 확인
//   useEffect(() => {
//     const handlePasswordReset = async () => {
//       // console.log("Starting password reset process");
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       // console.log("Current session:", session);

//       if (session) {
//         // console.log("Valid session found");
//         setMessage("비밀번호를 재설정할 수 있습니다.");
//       } else {
//         // console.log("No valid session found");
//         setMessage(
//           "유효하지 않은 접근입니다. 비밀번호 재설정 이메일을 다시 요청해 주세요."
//         );
//       }
//       setIsLoading(false);
//     };

//     handlePasswordReset();
//   }, []);

//   // 비밀번호 재설정 핸들러
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Attempting to reset password");
//     try {
//       const { data, error } = await supabase.auth.updateUser({ password });
//       if (error) throw error;
//       console.log("Password reset successful", data);
//       setMessage("비밀번호가 성공적으로 재설정되었습니다.");
//       // 2초 후 로그인 페이지로 리다이렉트
//       setTimeout(() => router.push("/auth/login"), 2000);
//     } catch (error) {
//       console.error("Password reset error:", error);
//       if (error instanceof Error) {
//         setMessage(`오류: ${error.message}`);
//       } else {
//         setMessage("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.");
//       }
//     }
//   };

//   // 로딩 중 표시
//   if (isLoading) {
//     return <div>로딩 중...</div>;
//   }

//   // 컴포넌트 렌더링
//   return (
//     <div className="max-w-md mx-auto mt-8">
//       <h1 className="text-2xl font-bold mb-4">새 비밀번호 설정</h1>
//       {message !== "비밀번호를 재설정할 수 있습니다." ? (
//         <p className="text-center">{message}</p>
//       ) : (
//         <form onSubmit={handleResetPassword}>
//           <AuthInput
//             id="password"
//             name="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="새 비밀번호"
//             required
//           />
//           <AuthButton type="submit" className="w-full mt-4">
//             비밀번호 변경
//           </AuthButton>
//         </form>
//       )}
//     </div>
//   );
// };
