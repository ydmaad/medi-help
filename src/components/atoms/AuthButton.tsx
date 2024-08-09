// 목적: 인증 관련 버튼을 위한 재사용 가능한 컴포넌트
import React from "react";

type AuthButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-brand-primary-500 text-white py-2 rounded-md ${className}`}
  >
    {children}
  </button>
);
