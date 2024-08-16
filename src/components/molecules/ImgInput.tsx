import Image from "next/image";
import React, { ChangeEvent } from "react";

interface ImgInput {
  onImgChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ImgInputMobile = ({ onImgChange }: ImgInput) => {
  return (
    <div className=" border border-brand-gray-600 rounded py-3 flex desktop:hidden items-center justify-center ">
      <label className="inline-flex items-center cursor-pointer text-gray-600">
        <Image
          src="/addImage.svg"
          alt="이미지추가버튼"
          width={20}
          height={20}
          className="mr-1"
        ></Image>
        이미지 추가 (최대 50MB)
        <input type="file" multiple onChange={onImgChange} className="hidden" />
      </label>
    </div>
  );
};

export const ImgInputDesk = ({ onImgChange }: ImgInput) => {
  return (
    <div className="mt-4 hidden desktop:flex">
      <label className="inline-flex items-center cursor-pointer text-gray-600 ml-3 mb-2">
        <Image
          src="/addImage.svg"
          alt="이미지추가버튼"
          width={20}
          height={20}
          className="mr-1"
        />
        사진 추가 (최대 50MB)
        <input type="file" multiple onChange={onImgChange} className="hidden" />
      </label>
    </div>
  );
};
