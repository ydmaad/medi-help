// 목적: 비밀번호 입력 필드와 표시/숨김 토글 기능을 결합한 컴포넌트

import React, { useState, ChangeEvent } from "react";
import { AuthInput } from "../atoms/AuthInput";
import Image from "next/image";

type AuthPasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  isValid?: boolean;
};

export const AuthPasswordInput: React.FC<AuthPasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  isValid = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AuthInput
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pr-10"
        isValid={isValid}
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
