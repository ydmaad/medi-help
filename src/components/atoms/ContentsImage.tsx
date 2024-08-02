"use client";

import React from "react";

interface ContentsImageProps {
  src?: string | null;
}

const ContentsImage = ({ src }: ContentsImageProps) => {
  if (!src) return null;

  return (
    <div className="w-[106px] h-[106px]">
      <img
        src={src}
        alt="contents"
        className="w-[106px] h-[106px] rounded-[4px] object-cover"
      />
    </div>
  );
};

export default ContentsImage;
