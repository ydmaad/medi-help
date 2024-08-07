// 목적: 인증 관련 입력 필드를 위한 재사용 가능한 컴포넌트
import React from "react";

type AuthInputProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export const AuthInput: React.FC<AuthInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
);
