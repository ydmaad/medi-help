"use client";

import React from "react";

interface ContentsImageProps {
  src?: string | null;
}

const ContentsImage = ({ src }: ContentsImageProps) => {
  return (
    <div className="w-[106px] h-[106px]">
      {src ? (
        <img
          src={src}
          alt="contents"
          className="w-full h-full rounded-[4px] object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-[4px] bg-transparent" />
      )}
    </div>
  );
};

export default ContentsImage;
