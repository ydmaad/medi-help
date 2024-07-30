"use client";

import React from "react";

interface MainTitleProps {
  text: string;
}

const MainTitle = ({ text }: MainTitleProps) => {
  return <h1 className="text-brand-gray-600 font-bold text-[20px]">{text}</h1>;
};

export default MainTitle;
