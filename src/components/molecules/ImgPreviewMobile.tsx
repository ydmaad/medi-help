import Image from "next/image";
import React from "react";

interface ImgPreviewMobileProps {
  img: File;
  index: number;
  onImgRemove: (index: number) => void;
}

const ImgPreviewMobile = ({
  img,
  index,
  onImgRemove,
}: ImgPreviewMobileProps) => {
  return (
    <div key={index} className="w-[60px] h-[60px] relative mr-2">
      <Image
        src={URL.createObjectURL(img)}
        alt={`Preview ${index}`}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
      <button
        onClick={() => onImgRemove(index)}
        className="absolute top-[13px] left-[20px] text-white flex items-center justify-center text-xs"
        style={{ transform: "translate(50%, -50%)" }}
      >
        <Image
          src="/imageDelBtn.svg"
          alt="이미지삭제버튼"
          width={24}
          height={24}
        ></Image>
      </button>
    </div>
  );
};

export default ImgPreviewMobile;
