import React from "react";
import MainLogo from "../atoms/MainLogo";

const Footer = () => {
  return (
    <footer className="w-full h-[65px] bg-brand-gray-50 mt-10">
      <div className="flex items-center justify-between h-full mx-[36px]">
        <MainLogo />
        <div className="flex items-center">
          <p className="text-brand-gray-600 mr-[24px]">
            엔지니어ㅣ양민애 최슬기 이세영 김도연 방지영
          </p>
          <p className="text-brand-gray-600">디자이너ㅣ박유리 정수현</p>
        </div>
        <p className="text-brand-gray-600">
          ⓒ2024 MEDIHELP. all rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
