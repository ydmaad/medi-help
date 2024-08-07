// 목적: 핸드폰 번호 입력을 위한 재사용 가능한 컴포넌트

import React from "react";

type AuthPhoneInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const AuthPhoneInput: React.FC<AuthPhoneInputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <input
    type="tel"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
);
