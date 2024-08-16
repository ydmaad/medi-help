import React from "react";
import MainLogo from "../atoms/MainLogo";

const Footer = () => {
  return (
    <>
      <footer className="flex desktop:hidden w-full h-auto bg-brand-gray-50 mt-10">
        <div className="flex flex-col items-center justify-between h-full mx-[36px]">
          <div className="flex flex-col items-start mt-[24px]">
            <p className="text-brand-gray-600 mr-[24px] mb-[8px]">
              엔지니어ㅣ양민애 최슬기 이세영 김도연 방지영
            </p>
            <p className="text-brand-gray-600">디자이너ㅣ박유리 정수현</p>
          </div>
          <div className="flex my-5 items-center">
            <MainLogo />
            <div className="text-brand-gray-600 ml-[24px]">
              ⓒ2024 MEDIHELP. all rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <footer className="hidden desktop:flex w-full h-[65px] bg-brand-gray-50 mt-10">
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
    </>
  );
};

export default Footer;
