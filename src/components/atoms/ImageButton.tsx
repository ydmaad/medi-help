"use client";
import React from "react";
import Link from "next/link";

interface ImageButtonProps {
  src: string;
  alt: string;
  href?: string; // href는 선택적 prop으로 변경
  onClick?: () => void; // onClick prop 추가
}

const ImageButton = ({ src, alt, href, onClick }: ImageButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick이 정의된 경우 실행
    }
  };

  return (
    <div className="text-center my-2 hover:font-bold">
      {href ? (
        <Link href={href}>
          <img src={src} alt={alt} className="cursor-pointer" />
        </Link>
      ) : (
        <img
          src={src}
          alt={alt}
          className="cursor-pointer"
          onClick={handleClick} // 클릭 이벤트 처리
        />
      )}
    </div>
  );
};

export default ImageButton;
