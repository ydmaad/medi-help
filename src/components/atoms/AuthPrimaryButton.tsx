// 목적: 인증 관련 버튼의 이메일 중복확인을 위한 컴포넌트
// src/components/atoms/AuthPrimaryButton.tsx

import React from "react";

type AuthPrimaryButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  isActive?: boolean;
  children: React.ReactNode;
};

export const AuthPrimaryButton: React.FC<AuthPrimaryButtonProps> = ({
  onClick,
  type = "button",
  className = "",
  isActive = true,
  children,
}) => {
  const baseStyles = "py-2 font-semibold text-[18px] rounded";
  const activeStyles = "bg-brand-primary-500 text-white";
  const inactiveStyles = "bg-brand-gray-200 text-brand-gray-600";

  const buttonStyles = `${baseStyles} ${isActive ? activeStyles : inactiveStyles} ${className}`;

  return (
    <button onClick={onClick} type={type} className={buttonStyles}>
      {children}
    </button>
  );
};
