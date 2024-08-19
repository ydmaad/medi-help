"use client";

import React from "react";

interface CardSubTitleProps {
  text: string;
}

const MagazineSubtitle = ({ text }: CardSubTitleProps) => {
  return (
    <div className="text-gray-800 text-[12px] desktop:text-[16px] line-clamp-1 overflow-hidden text-ellipsis mt-[2px]">
      {text}
    </div>
  );
};

export default MagazineSubtitle;
