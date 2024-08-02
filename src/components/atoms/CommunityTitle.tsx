"use client";

import React from "react";

interface CommunityTitleProps {
  text: string;
}

const CommunityTitle = ({ text }: CommunityTitleProps) => {
  return <div className="text-gray-1000 font-bold text-[18px]">{text}</div>;
};

export default CommunityTitle;
