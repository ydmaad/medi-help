"use client";

import { useRouter } from "next/navigation";

export default function SignUpCompletePage() {
  const router = useRouter();

  const goToHome = () => {
    router.replace("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">회원가입이 완료되었습니다.</h2>
        <button
          onClick={goToHome}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
