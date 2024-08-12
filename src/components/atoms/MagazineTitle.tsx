"use client";

import React from "react";

interface MagazineTitleProps {
  text: string;
}

const MagazineTitle = ({ text }: MagazineTitleProps) => {
  return (
    <h1 className="text-brand-gray-1000 font-bold text-[16px] mt-[60px] mb-[16px]">
      {text}
    </h1>
  );
};

export default MagazineTitle;
