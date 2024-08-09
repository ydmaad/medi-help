// 목적: 소셜 로그인 버튼을 위한 재사용 가능한 컴포넌트
import React from "react";
import Image from "next/image";
import { AuthButton } from "../atoms/AuthButton";

type AuthSocialButtonProps = {
  provider: "kakao" | "google";
  onClick: () => void;
};

export const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  provider,
  onClick,
}) => {
  const providerConfig = {
    kakao: {
      text: "카카오 로그인",
      bgColor: "bg-yellow-300",
      textColor: "text-black",
      iconSrc: "/kakao_icon.svg",
    },
    google: {
      text: "구글 로그인",
      bgColor: "bg-white",
      textColor: "text-black",
      iconSrc: "/google_icon.svg",
    },
  };

  const config = providerConfig[provider];

  return (
    <AuthButton
      onClick={onClick}
      className={`flex items-center justify-center ${config.bgColor} ${config.textColor}`}
    >
      <Image
        src={config.iconSrc}
        alt={`${provider} icon`}
        width={20}
        height={20}
        className="mr-2"
      />
      {config.text}
    </AuthButton>
  );
};
