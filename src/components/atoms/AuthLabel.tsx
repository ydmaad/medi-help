// 목적: 인증 관련 입력 필드의 라벨을 위한 컴포넌트
import React from "react";

type AuthLabelProps = {
  htmlFor: string;
  children: React.ReactNode;
};

export const AuthLabel: React.FC<AuthLabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm text-gray-600">
    {children}
  </label>
);
