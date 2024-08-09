// 목적: 인증 관련 폼의 레이아웃을 제공하는 컴포넌트
import React from "react";

type AuthFormLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  children,
}) => (
  <div className="flex flex-col items-center justify-center">
    <div className="w-full max-w-md bg-white rounded-lg p-8">
      {/* 폼 제목 */}
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      {/* 폼 내용 */}
      {children}
    </div>
  </div>
);
