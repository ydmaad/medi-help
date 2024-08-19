"use client";

import React from "react";

interface MainTitleProps {
  text: string;
}

const MainTitle = ({ text }: MainTitleProps) => {
  return (
    <h1 className="desktop:text-brand-gray-600 text-brand-gray-1000 font-bold desktop:text-[20px] text-[18px]">
      {text}
    </h1>
  );
};

export default MainTitle;
