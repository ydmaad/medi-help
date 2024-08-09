// 목적: 인증 과정에서 발생하는 오류 메시지를 표시하는 컴포넌트
import React from "react";

type AuthErrorMessageProps = {
  message: string;
};

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({
  message,
}) => <p className="text-red-500 text-sm">{message}</p>;
