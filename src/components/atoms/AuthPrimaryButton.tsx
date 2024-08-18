// 목적: 인증 관련 버튼의 이메일 중복확인을 위한 컴포넌트
// src/components/atoms/AuthPrimaryButton.tsx

import React from "react";

type AuthPrimaryButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export const AuthPrimaryButton: React.FC<AuthPrimaryButtonProps> = ({
  onClick,
  type = "button",
  className = "",
  disabled = false,
  children,
}) => (
  <button
    onClick={onClick}
    type={type}
    className={`py-2 bg-brand-primary-500 text-white font-black text-[18px] rounded-md ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);
