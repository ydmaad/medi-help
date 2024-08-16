import Image from "next/image";
import React from "react";

interface ImgPreviewDeskProps {
  img: File;
  index: number;
  onImgRemove: (index: number) => void;
}
const ImgPreviewDesk = ({ img, index, onImgRemove }: ImgPreviewDeskProps) => {
  return (
    <div key={index} className="w-24 h-24 m-2 relative">
      <Image
        src={URL.createObjectURL(img)}
        alt={`Preview ${index}`}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
      <button
        onClick={() => onImgRemove(index)}
        className="absolute top-[17px] left-[40px] text-white  flex items-center justify-center text-xs"
        style={{ transform: "translate(50%, -50%)" }}
      >
        <Image
          src="/imageDelBtn.svg"
          alt="이미지삭제버튼"
          width={38}
          height={38}
        ></Image>
      </button>
    </div>
  );
};

export default ImgPreviewDesk;
