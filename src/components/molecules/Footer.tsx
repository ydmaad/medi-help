import React from "react";
import MainLogo from "../atoms/MainLogo";

const Footer = () => {
  return (
    <>
      <footer className="flex desktop:hidden w-full  h-auto bg-brand-gray-50 mt-10">
        <div className="flex flex-col items-center max-w-[335px] mx-auto justify-center h-full">
          <div className="flex flex-col items-start mt-[24px]">
            <div className="flex text-brand-gray-600 justify-center text-[10px] mb-[8px]">
              <p>개발자</p>
              <p className="mx-[16px] ">ㅣ</p>
              <p className="mr-[12px] ">양민애</p>
              <p className="mr-[12px] ">최슬기</p>
              <p className="mr-[12px] ">이세영</p>
              <p className="mr-[12px] ">김도연</p>
              <p className="mr-[12px] ">방지영</p>
            </div>
            <div className="flex text-brand-gray-600 justify-center  text-[10px] mb-[8px]">
              <p>디자이너</p>
              <p className="ml-[8px] mr-[16px] ">ㅣ</p>
              <p className="mr-[12px] ">박유리</p>
              <p className="mr-[12px] ">정수현</p>
            </div>
          </div>
          <div className="flex my-5 items-center justify-center ">
            <MainLogo />
            <div className="text-brand-gray-600 ml-[24px] text-[10px]">
              ⓒ2024 MEDIHELP. all rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <footer className="hidden desktop:flex w-full h-[65px] bg-brand-gray-50 mt-10 relative">
        <div className="flex items-center justify-between h-full mx-[36px] w-full">
          <MainLogo />
          <p className="text-brand-gray-600 text-[12px]">
            ⓒ2024 MEDIHELP. all rights reserved.
          </p>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <p className="text-brand-gray-600 mr-[24px] text-[12px]">
            엔지니어ㅣ양민애 최슬기 이세영 김도연 방지영
          </p>
          <p className="text-brand-gray-600 text-[12px]">
            디자이너ㅣ박유리 정수현
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
