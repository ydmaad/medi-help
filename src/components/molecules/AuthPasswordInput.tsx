// 목적: 비밀번호 입력 필드와 표시/숨김 토글 기능을 결합한 컴포넌트
import React, { useState } from "react";
import { AuthInput } from "../atoms/AuthInput";
import Image from "next/image";

type AuthPasswordInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; // placeholder를 필수 prop으로 추가
  className?: string; // 선택적 className prop 추가
};

export const AuthPasswordInput: React.FC<AuthPasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder,
  className = "", // 기본값 설정
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AuthInput
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pr-10" // 오른쪽에 아이콘을 위한 공간 확보
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <Image
          src={showPassword ? "/close_eye_icon.svg" : "/open_eye_icon.svg"}
          alt="Toggle password visibility"
          width={18}
          height={12}
        />
      </button>
    </div>
  );
};
