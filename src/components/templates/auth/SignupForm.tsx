// 목적: 회원가입 폼의 전체 구조와 로직을 관리하는 컴포넌트
// src/components/templates/auth/SignupForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { AuthInput } from "../../atoms/AuthInput";
import { AuthButton } from "../../atoms/AuthButton";
import { AuthPrimaryButton } from "../../atoms/AuthPrimaryButton";
import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
import { AuthTermsCheckbox } from "../../molecules/AuthTermsCheckbox";
import { termsOfService } from "@/constants/termsOfService";
import { privacyPolicy } from "@/constants/privacyPolicy";
import { supabase } from "@/utils/supabase/client";

// SignupForm 컴포넌트의 props 타입 정의
type SignupFormProps = {
  onSubmit: (data: {
    nickname: string;
    email: string;
    password: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => void;
  error?: string;
};

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, error }) => {
  // 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 유효성 상태 관리
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordConfirmValid, setPasswordConfirmValid] = useState<
    boolean | null
  >(null);

  // 이메일 중복 확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  // 닉네임 중복 확인 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 폼 유효성 검사 함수
  const isFormValid = () => {
    return (
      nicknameValid === true &&
      isNicknameAvailable &&
      emailValid === true &&
      isEmailChecked &&
      isEmailAvailable &&
      passwordValid === true &&
      passwordConfirmValid === true &&
      agreeTerms &&
      agreePrivacy
    );
  };

  // 이메일 중복 확인 함수
  const checkEmail = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (error) {
      console.error(error.message);
      return false;
    }
    return data.length === 0;
  };

  // 닉네임 중복 확인 함수
  const checkNickname = async (nickname: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname);

    if (error) {
      console.error(error.message);
      return false;
    }
    return data.length === 0;
  };

  // 이메일 중복 확인 핸들러
  const handleEmailCheck = async () => {
    if (!email || !emailValid) {
      alert("유효한 이메일을 입력해주세요.");
      return;
    }

    const isAvailable = await checkEmail(email);
    setIsEmailChecked(true);
    setIsEmailAvailable(isAvailable);

    if (isAvailable) {
      alert("사용 가능한 이메일입니다.");
    } else {
      alert("이미 사용 중인 이메일입니다.");
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);

    if (newNickname.length >= 2 && newNickname.length <= 6) {
      const isAvailable = await checkNickname(newNickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(isAvailable);
      setNicknameValid(true); // 길이 조건을 만족하면 우선 유효하다고 설정
    } else {
      setNicknameValid(false);
    }
  };

  // 이메일 변경 시 중복 확인 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  }, [email]);

  // 이메일 유효성 검사
  useEffect(() => {
    if (email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(null);
    }
  }, [email]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (password !== "") {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 6;

      setPasswordValid(
        hasLetter && hasNumber && hasSpecialChar && isLongEnough
      );
    } else {
      setPasswordValid(null);
    }
  }, [password]);

  // 비밀번호 확인 유효성 검사
  useEffect(() => {
    if (passwordConfirm !== "") {
      setPasswordConfirmValid(password === passwordConfirm);
    } else {
      setPasswordConfirmValid(null);
    }
  }, [password, passwordConfirm]);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
    } else {
      // 에러 메시지 표시 로직
      let errors = [];
      if (!nicknameValid || !isNicknameAvailable)
        errors.push("닉네임을 확인해주세요.");
      if (!emailValid || !isEmailChecked || !isEmailAvailable)
        errors.push("이메일을 확인해주세요.");
      if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
      if (!passwordConfirmValid)
        errors.push("비밀번호 확인이 일치하지 않습니다.");
      if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

      alert(errors.join("\n"));
    }
  };

  return (
    <div className="w-[336px] desktop:w-[386px] max-w-md">
      <h2 className="text-[28px] font-bold text-center text-brand-gray-800 mb-6">
        회원 가입
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 닉네임 입력 필드 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            닉네임
          </label>
          <AuthInput
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임 설정"
            className="w-full px-3 py-2"
            isValid={nicknameValid !== false}
          />
          {nicknameValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              사용할 수 없는 닉네임입니다.
            </p>
          )}
          {isNicknameChecked && isNicknameAvailable && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              사용할 수 있는 닉네임입니다.
            </p>
          )}
          {nicknameValid === true &&
            isNicknameChecked &&
            !isNicknameAvailable && (
              <p className="text-[#F66555] text-[12px] mt-1">
                이미 사용 중인 닉네임입니다.
              </p>
            )}
        </div>

        {/* 이메일 입력 필드 */}
        <div>
          <label
            htmlFor="email"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            이메일 입력
          </label>
          <div className="flex items-center justify-between">
            <AuthInput
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@도메인.com"
              className="px-3 py-2 text-brand-gray-1000"
              isValid={
                emailValid !== false && (!isEmailChecked || isEmailAvailable)
              }
            />
            <div>
              <AuthPrimaryButton
                onClick={handleEmailCheck}
                className="px-1 ml-[10px]"
                isActive={emailValid === true}
              >
                중복확인
              </AuthPrimaryButton>
            </div>
          </div>
          {emailValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              올바른 이메일 형식이 아닙니다.
            </p>
          )}
          {emailValid === true && !isEmailChecked && (
            <p className="text-[#F66555] text-[12px] mt-1">
              이메일 중복 확인이 필요합니다.
            </p>
          )}
          {isEmailChecked && isEmailAvailable && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              사용할 수 있는 이메일입니다.
            </p>
          )}
          {isEmailChecked && !isEmailAvailable && (
            <p className="text-[#F66555] text-[12px] mt-1">
              이미 사용 중인 이메일입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div>
          <label
            htmlFor="password"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            비밀번호 입력
          </label>
          <AuthPasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
            isValid={passwordValid !== false}
          />
          {passwordValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              영문자, 숫자, 특수문자 포함하여 최소 6자 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-[16px] text-brand-gray-1000 mb-1"
          >
            비밀번호 확인
          </label>
          <AuthPasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="다시 한번 입력해 주세요."
            isValid={passwordConfirmValid !== false}
          />
          {passwordConfirmValid === false && (
            <p className="text-[#F66555] text-[12px] mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          {passwordConfirmValid === true && (
            <p className="text-[#00D37B] text-[12px] mt-1">
              비밀번호가 일치합니다.
            </p>
          )}
        </div>

        {/* 약관 동의 체크박스 */}
        <AuthTermsCheckbox
          id="agreeTerms"
          checked={agreeTerms}
          onChange={setAgreeTerms}
          label="이용약관 동의 (필수)"
          modalTitle="이용약관"
          modalContent={termsOfService}
        />
        <AuthTermsCheckbox
          id="agreePrivacy"
          checked={agreePrivacy}
          onChange={setAgreePrivacy}
          label="개인정보 처리방침 동의 (필수)"
          modalTitle="개인정보 처리방침"
          modalContent={privacyPolicy}
        />

        {/* 에러 메시지 */}
        {error && <AuthErrorMessage message={error} />}

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={`w-full h-[48px] text-[18px] font-semibold rounded-md transition-colors duration-300 ${
            isFormValid()
              ? "!bg-brand-primary-500 !text-white hover:!bg-brand-primary-600"
              : "!bg-brand-gray-200 !text-brand-gray-600"
          }`}
        >
          회원가입
        </button>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-4 text-center text-sm text-[#F66555]">{error}</p>
        )}
      </form>
    </div>
  );
};

// 최신 코드
// "use client";

// import React, { useState, useEffect } from "react";
// import { AuthInput } from "../../atoms/AuthInput";
// import { AuthPrimaryButton } from "../../atoms/AuthPrimaryButton";
// import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
// import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
// import { AuthTermsCheckbox } from "../../molecules/AuthTermsCheckbox";
// import { termsOfService } from "@/constants/termsOfService";
// import { privacyPolicy } from "@/constants/privacyPolicy";
// import { supabase } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";

// type SignupFormProps = {
//   onSubmit: (data: {
//     nickname: string;
//     email: string;
//     password: string;
//     agreeTerms: boolean;
//     agreePrivacy: boolean;
//   }) => Promise<void>;
//   error?: string;
// };

// export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, error }) => {
//   // 라우터 초기화
//   const router = useRouter();

//   // 상태 관리
//   const [nickname, setNickname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreePrivacy, setAgreePrivacy] = useState(false);

//   // 유효성 상태 관리
//   const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
//   const [emailValid, setEmailValid] = useState<boolean | null>(null);
//   const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
//   const [passwordConfirmValid, setPasswordConfirmValid] = useState<
//     boolean | null
//   >(null);

//   // 이메일 중복 확인 상태
//   const [isEmailChecked, setIsEmailChecked] = useState(false);
//   const [isEmailAvailable, setIsEmailAvailable] = useState(false);

//   // 회원가입 완료 상태
//   const [isSignupComplete, setIsSignupComplete] = useState(false);

//   // 폼 유효성 검사 함수
//   const isFormValid = () => {
//     return (
//       nicknameValid === true &&
//       emailValid === true &&
//       isEmailChecked &&
//       isEmailAvailable &&
//       passwordValid === true &&
//       passwordConfirmValid === true &&
//       agreeTerms &&
//       agreePrivacy
//     );
//   };

//   // 이메일 중복 확인 함수
//   const checkEmail = async (email: string) => {
//     const { data, error } = await supabase
//       .from("users")
//       .select("email")
//       .eq("email", email);

//     if (error) {
//       console.error(error.message);
//       return false;
//     }
//     return data.length === 0;
//   };

//   // 이메일 중복 확인 핸들러
//   const handleEmailCheck = async () => {
//     if (!email || !emailValid) {
//       alert("유효한 이메일을 입력해주세요.");
//       return;
//     }

//     const isAvailable = await checkEmail(email);
//     setIsEmailChecked(true);
//     setIsEmailAvailable(isAvailable);

//     if (isAvailable) {
//       alert("사용 가능한 이메일입니다.");
//     } else {
//       alert("이미 사용 중인 이메일입니다.");
//     }
//   };

//   // 이메일 변경 시 중복 확인 상태 초기화
//   useEffect(() => {
//     setIsEmailChecked(false);
//     setIsEmailAvailable(false);
//   }, [email]);

//   // 닉네임 유효성 검사
//   useEffect(() => {
//     if (nickname !== "") {
//       setNicknameValid(nickname.length >= 2 && nickname.length <= 6);
//     } else {
//       setNicknameValid(null);
//     }
//   }, [nickname]);

//   // 이메일 유효성 검사
//   useEffect(() => {
//     if (email !== "") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       setEmailValid(emailRegex.test(email));
//     } else {
//       setEmailValid(null);
//     }
//   }, [email]);

//   // 비밀번호 유효성 검사
//   useEffect(() => {
//     if (password !== "") {
//       const hasLetter = /[a-zA-Z]/.test(password);
//       const hasNumber = /\d/.test(password);
//       const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//       const isLongEnough = password.length >= 6;

//       setPasswordValid(
//         hasLetter && hasNumber && hasSpecialChar && isLongEnough
//       );
//     } else {
//       setPasswordValid(null);
//     }
//   }, [password]);

//   // 비밀번호 확인 유효성 검사
//   useEffect(() => {
//     if (passwordConfirm !== "") {
//       setPasswordConfirmValid(password === passwordConfirm);
//     } else {
//       setPasswordConfirmValid(null);
//     }
//   }, [password, passwordConfirm]);

//   // 폼 제출 핸들러
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isFormValid()) {
//       try {
//         // 회원가입 로직 실행
//         await onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
//         // 회원가입 성공 시 complete 페이지로 이동
//         router.push("/auth/complete");
//       } catch (error) {
//         console.error("Signup error:", error);
//         alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
//       }
//     } else {
//       // 에러 메시지 표시 로직
//       let errors = [];
//       if (!nicknameValid) errors.push("닉네임을 확인해주세요.");
//       if (!emailValid || !isEmailChecked || !isEmailAvailable)
//         errors.push("이메일을 확인해주세요.");
//       if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
//       if (!passwordConfirmValid)
//         errors.push("비밀번호 확인이 일치하지 않습니다.");
//       if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

//       alert(errors.join("\n"));
//     }
//   };

//   // 회원가입 완료 시 렌더링할 컴포넌트
//   if (isSignupComplete) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="w-[334px] desktop:w-[384px] max-w-md text-center">
//           <h1 className="text-[28px] font-bold text-brand-gray-800 mb-[40px]">
//             회원가입이 완료되었습니다.
//           </h1>
//           <div className="flex justify-between">
//             <button
//               onClick={() => router.push("/")}
//               className="w-[156px] h-[48px] text-[18px] font-semibold rounded-md
//                          bg-brand-primary-50 text-brand-primary-500
//                          hover:bg-brand-primary-100 transition-colors duration-300"
//             >
//               홈으로
//             </button>
//             <button
//               onClick={() => router.push("/auth/login")}
//               className="w-[204px] h-[48px] text-[18px] font-semibold rounded-md
//                          bg-brand-primary-500 text-white
//                          hover:bg-brand-primary-600 transition-colors duration-300"
//             >
//               로그인
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 기존의 회원가입 폼 렌더링
//   return (
//     <div className="w-[336px] desktop:w-[386px] max-w-md">
//       <h2 className="text-[28px] font-bold text-center text-brand-gray-800 mb-6">
//         회원 가입
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* 닉네임 입력 필드 */}
//         <div>
//           <label
//             htmlFor="nickname"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             닉네임
//           </label>
//           <AuthInput
//             id="nickname"
//             name="nickname"
//             type="text"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//             placeholder="닉네임 설정"
//             className="w-full px-3 py-2"
//             isValid={nicknameValid !== false}
//           />
//           {nicknameValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               사용할 수 없는 닉네임입니다.
//             </p>
//           )}
//           {nicknameValid === true && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               사용할 수 있는 닉네임입니다.
//             </p>
//           )}
//         </div>

//         {/* 이메일 입력 필드 */}
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             이메일 입력
//           </label>
//           <div className="flex items-center justify-between">
//             <AuthInput
//               id="email"
//               name="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="example@도메인.com"
//               className="px-3 py-2 text-brand-gray-1000"
//               isValid={
//                 emailValid !== false && (!isEmailChecked || isEmailAvailable)
//               }
//             />
//             <div>
//               <AuthPrimaryButton
//                 onClick={handleEmailCheck}
//                 className="px-1 ml-[10px]"
//                 isActive={emailValid === true}
//               >
//                 중복확인
//               </AuthPrimaryButton>
//             </div>
//           </div>
//           {emailValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               올바른 이메일 형식이 아닙니다.
//             </p>
//           )}
//           {emailValid === true && !isEmailChecked && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               이메일 중복 확인이 필요합니다.
//             </p>
//           )}
//           {isEmailChecked && isEmailAvailable && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               사용할 수 있는 이메일입니다.
//             </p>
//           )}
//           {isEmailChecked && !isEmailAvailable && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               이미 사용 중인 이메일입니다.
//             </p>
//           )}
//         </div>

//         {/* 비밀번호 입력 필드 */}
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             비밀번호 입력
//           </label>
//           <AuthPasswordInput
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="비밀번호를 입력해 주세요."
//             isValid={passwordValid !== false}
//           />
//           {passwordValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               영문자, 숫자, 특수문자 포함하여 최소 6자 이상이어야 합니다.
//             </p>
//           )}
//         </div>

//         {/* 비밀번호 확인 입력 필드 */}
//         <div>
//           <label
//             htmlFor="passwordConfirm"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             비밀번호 확인
//           </label>
//           <AuthPasswordInput
//             id="passwordConfirm"
//             name="passwordConfirm"
//             value={passwordConfirm}
//             onChange={(e) => setPasswordConfirm(e.target.value)}
//             placeholder="다시 한번 입력해 주세요."
//             isValid={passwordConfirmValid !== false}
//           />
//           {passwordConfirmValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               비밀번호가 일치하지 않습니다.
//             </p>
//           )}
//           {passwordConfirmValid === true && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               비밀번호가 일치합니다.
//             </p>
//           )}
//         </div>

//         {/* 약관 동의 체크박스 */}
//         <AuthTermsCheckbox
//           id="agreeTerms"
//           checked={agreeTerms}
//           onChange={setAgreeTerms}
//           label="이용약관 동의 (필수)"
//           modalTitle="이용약관"
//           modalContent={termsOfService}
//         />
//         <AuthTermsCheckbox
//           id="agreePrivacy"
//           checked={agreePrivacy}
//           onChange={setAgreePrivacy}
//           label="개인정보 처리방침 동의 (필수)"
//           modalTitle="개인정보 처리방침"
//           modalContent={privacyPolicy}
//         />

//         {/* 에러 메시지 */}
//         {error && <AuthErrorMessage message={error} />}

//         {/* 회원가입 버튼 */}
//         <button
//           type="submit"
//           className={`w-full h-[48px] text-[18px] font-semibold rounded-md transition-colors duration-300 ${
//             isFormValid()
//               ? "!bg-brand-primary-500 !text-white hover:!bg-brand-primary-600"
//               : "!bg-brand-gray-200 !text-brand-gray-600"
//           }`}
//         >
//           회원가입
//         </button>

//         {/* 에러 메시지 */}
//         {error && (
//           <p className="mt-4 text-center text-sm text-[#F66555]">{error}</p>
//         )}
//       </form>
//     </div>
//   );
// };

// 기존 코드
// "use client";

// import React, { useState, useEffect } from "react";
// import { AuthInput } from "../../atoms/AuthInput";
// import { AuthButton } from "../../atoms/AuthButton";
// import { AuthPrimaryButton } from "../../atoms/AuthPrimaryButton";
// import { AuthErrorMessage } from "../../atoms/AuthErrorMessage";
// import { AuthPasswordInput } from "../../molecules/AuthPasswordInput";
// import { AuthTermsCheckbox } from "../../molecules/AuthTermsCheckbox";
// import { termsOfService } from "@/constants/termsOfService";
// import { privacyPolicy } from "@/constants/privacyPolicy";
// import { supabase } from "@/utils/supabase/client";

// type SignupFormProps = {
//   onSubmit: (data: {
//     nickname: string;
//     email: string;
//     password: string;
//     agreeTerms: boolean;
//     agreePrivacy: boolean;
//   }) => void;
//   error?: string;
// };

// export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, error }) => {
//   // 상태 관리
//   const [nickname, setNickname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreePrivacy, setAgreePrivacy] = useState(false);

//   // 유효성 상태 관리
//   const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
//   const [emailValid, setEmailValid] = useState<boolean | null>(null);
//   const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
//   const [passwordConfirmValid, setPasswordConfirmValid] = useState<
//     boolean | null
//   >(null);

//   // 이메일 중복 확인 상태
//   const [isEmailChecked, setIsEmailChecked] = useState(false);
//   const [isEmailAvailable, setIsEmailAvailable] = useState(false);

//   // 폼 유효성 검사 함수
//   const isFormValid = () => {
//     return (
//       nicknameValid === true &&
//       emailValid === true &&
//       isEmailChecked &&
//       isEmailAvailable &&
//       passwordValid === true &&
//       passwordConfirmValid === true &&
//       agreeTerms &&
//       agreePrivacy
//     );
//   };

//   // 이메일 중복 확인 함수
//   const checkEmail = async (email: string) => {
//     const { data, error } = await supabase
//       .from("users")
//       .select("email")
//       .eq("email", email);

//     if (error) {
//       console.error(error.message);
//       return false;
//     }
//     return data.length === 0;
//   };

//   // 이메일 중복 확인 핸들러
//   const handleEmailCheck = async () => {
//     if (!email || !emailValid) {
//       alert("유효한 이메일을 입력해주세요.");
//       return;
//     }

//     const isAvailable = await checkEmail(email);
//     setIsEmailChecked(true);
//     setIsEmailAvailable(isAvailable);

//     if (isAvailable) {
//       alert("사용 가능한 이메일입니다.");
//     } else {
//       alert("이미 사용 중인 이메일입니다.");
//     }
//   };

//   // 이메일 변경 시 중복 확인 상태 초기화
//   useEffect(() => {
//     setIsEmailChecked(false);
//     setIsEmailAvailable(false);
//   }, [email]);

//   // 닉네임 유효성 검사
//   useEffect(() => {
//     if (nickname !== "") {
//       setNicknameValid(nickname.length >= 2 && nickname.length <= 6);
//     } else {
//       setNicknameValid(null);
//     }
//   }, [nickname]);

//   // 이메일 유효성 검사
//   useEffect(() => {
//     if (email !== "") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       setEmailValid(emailRegex.test(email));
//     } else {
//       setEmailValid(null);
//     }
//   }, [email]);

//   // 비밀번호 유효성 검사
//   useEffect(() => {
//     if (password !== "") {
//       const hasLetter = /[a-zA-Z]/.test(password);
//       const hasNumber = /\d/.test(password);
//       const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//       const isLongEnough = password.length >= 6;

//       setPasswordValid(
//         hasLetter && hasNumber && hasSpecialChar && isLongEnough
//       );
//     } else {
//       setPasswordValid(null);
//     }
//   }, [password]);

//   // 비밀번호 확인 유효성 검사
//   useEffect(() => {
//     if (passwordConfirm !== "") {
//       setPasswordConfirmValid(password === passwordConfirm);
//     } else {
//       setPasswordConfirmValid(null);
//     }
//   }, [password, passwordConfirm]);

//   // 폼 제출 핸들러
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isFormValid()) {
//       onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
//     } else {
//       // 에러 메시지 표시 로직
//       let errors = [];
//       if (!nicknameValid) errors.push("닉네임을 확인해주세요.");
//       if (!emailValid || !isEmailChecked || !isEmailAvailable)
//         errors.push("이메일을 확인해주세요.");
//       if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
//       if (!passwordConfirmValid)
//         errors.push("비밀번호 확인이 일치하지 않습니다.");
//       if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

//       alert(errors.join("\n"));
//     }
//   };

//   // const handleSubmit = (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   let errors = [];
//   //   if (!nicknameValid) errors.push("닉네임을 확인해주세요.");
//   //   if (!emailValid || !isEmailChecked || !isEmailAvailable)
//   //     errors.push("이메일을 확인해주세요.");
//   //   if (!passwordValid) errors.push("비밀번호를 확인해주세요.");
//   //   if (!passwordConfirmValid)
//   //     errors.push("비밀번호 확인이 일치하지 않습니다.");
//   //   if (!agreeTerms || !agreePrivacy) errors.push("약관에 동의해주세요.");

//   //   if (errors.length > 0) {
//   //     alert(errors.join("\n"));
//   //   } else {
//   //     onSubmit({ nickname, email, password, agreeTerms, agreePrivacy });
//   //   }
//   // };

//   return (
//     <div className="w-[336px] desktop:w-[386px] max-w-md">
//       <h2 className="text-[28px] font-bold text-center text-brand-gray-800 mb-6">
//         회원 가입
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* 닉네임 입력 필드 */}
//         <div>
//           <label
//             htmlFor="nickname"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             닉네임
//           </label>
//           <AuthInput
//             id="nickname"
//             name="nickname"
//             type="text"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//             placeholder="닉네임 설정"
//             className="w-full px-3 py-2"
//             isValid={nicknameValid !== false}
//           />
//           {nicknameValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               사용할 수 없는 닉네임입니다.
//             </p>
//           )}
//           {nicknameValid === true && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               사용할 수 있는 닉네임입니다.
//             </p>
//           )}
//         </div>

//         {/* 이메일 입력 필드 */}
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             이메일 입력
//           </label>
//           <div className="flex items-center justify-between">
//             <AuthInput
//               id="email"
//               name="nickname"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="example@도메인.com"
//               className="px-3 py-2 text-brand-gray-1000"
//               isValid={
//                 emailValid !== false && (!isEmailChecked || isEmailAvailable)
//               }
//             />
//             <div>
//               <AuthPrimaryButton
//                 onClick={handleEmailCheck}
//                 className="px-1 ml-[10px]"
//                 isActive={emailValid !== true}
//               >
//                 중복확인
//               </AuthPrimaryButton>
//             </div>
//           </div>
//           {emailValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               올바른 이메일 형식이 아닙니다.
//             </p>
//           )}
//           {emailValid === true && !isEmailChecked && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               이메일 중복 확인이 필요합니다.
//             </p>
//           )}
//           {isEmailChecked && isEmailAvailable && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               사용할 수 있는 이메일입니다.
//             </p>
//           )}
//           {isEmailChecked && !isEmailAvailable && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               이미 사용 중인 이메일입니다.
//             </p>
//           )}
//         </div>

//         {/* 비밀번호 입력 필드 */}
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             비밀번호 입력
//           </label>
//           <AuthPasswordInput
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="비밀번호를 입력해 주세요."
//             isValid={passwordValid !== false}
//           />
//           {passwordValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               영문자, 숫자, 특수문자 포함하여 최소 6자 이상이어야 합니다.
//             </p>
//           )}
//         </div>

//         {/* 비밀번호 확인 입력 필드 */}
//         <div>
//           <label
//             htmlFor="passwordConfirm"
//             className="block text-[16px] text-brand-gray-1000 mb-1"
//           >
//             비밀번호 확인
//           </label>
//           <AuthPasswordInput
//             id="passwordConfirm"
//             name="passwordConfirm"
//             value={passwordConfirm}
//             onChange={(e) => setPasswordConfirm(e.target.value)}
//             placeholder="다시 한번 입력해 주세요."
//             isValid={passwordConfirmValid !== false}
//           />
//           {passwordConfirmValid === false && (
//             <p className="text-[#F66555] text-[12px] mt-1">
//               비밀번호가 일치하지 않습니다.
//             </p>
//           )}
//           {passwordConfirmValid === true && (
//             <p className="text-[#00D37B] text-[12px] mt-1">
//               비밀번호가 일치합니다.
//             </p>
//           )}
//         </div>

//         {/* 약관 동의 체크박스 */}
//         <AuthTermsCheckbox
//           id="agreeTerms"
//           checked={agreeTerms}
//           onChange={setAgreeTerms}
//           label="이용약관 동의 (필수)"
//           modalTitle="이용약관"
//           modalContent={termsOfService}
//         />
//         <AuthTermsCheckbox
//           id="agreePrivacy"
//           checked={agreePrivacy}
//           onChange={setAgreePrivacy}
//           label="개인정보 처리방침 동의 (필수)"
//           modalTitle="개인정보 처리방침"
//           modalContent={privacyPolicy}
//         />

//         {/* 에러 메시지 */}
//         {error && <AuthErrorMessage message={error} />}

//         {/* 회원가입 버튼 */}
//         <button
//           type="submit"
//           className={`w-full h-[48px] text-[18px] font-semibold rounded-md transition-colors duration-300 ${
//             isFormValid()
//               ? "!bg-brand-primary-500 !text-white hover:!bg-brand-primary-600"
//               : "!bg-brand-gray-200 !text-brand-gray-600"
//           }`}
//         >
//           회원가입
//         </button>
//         {/* <AuthButton
//           type="submit"
//           className={`w-full text-[18px] font-semibold transition-colors duration-300 ${
//             isFormValid()
//               ? "text-white bg-brand-primary-500 hover:bg-brand-primary-600"
//               : "text-brand-gray-600 bg-brand-gray-200"
//           }`}
//         >
//           회원가입
//         </AuthButton> */}
//         {/* 에러 메시지 */}
//         {error && (
//           <p className="mt-4 text-center text-sm text-[#F66555]">{error}</p>
//         )}
//       </form>
//     </div>
//   );
// };
