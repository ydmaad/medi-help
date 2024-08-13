// 목적: 인증 관련 입력 필드를 위한 재사용 가능한 컴포넌트

import React, { ChangeEvent } from "react";

type AuthInputProps = {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
};

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`.trim()}
  />
);
