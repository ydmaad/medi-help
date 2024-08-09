"use client";

import React from "react";

interface ContentsImageProps {
  src?: string | null;
}

const ContentsImage = ({ src }: ContentsImageProps) => {
  if (!src) return null;

  return (
    <div className="w-full max-w-[106px] h-auto aspect-[1/1]">
      <img
        src={src}
        alt="contents"
        className="w-full h-full rounded-[4px] object-cover"
      />
    </div>
  );
};

export default ContentsImage;
