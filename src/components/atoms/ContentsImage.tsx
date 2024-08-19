"use client";

import React from "react";

interface ContentsImageProps {
  src?: string | null;
}

const ContentsImage = ({ src }: ContentsImageProps) => {
  if (!src) return null;

  return (
    <div className="w-[60px] h-[60px] desktop:w-[106px] desktop:h-[106px] ">
      <img
        src={src}
        alt="contents"
        className="w-full h-full rounded-[4px] object-cover"
      />
    </div>
  );
};

export default ContentsImage;
