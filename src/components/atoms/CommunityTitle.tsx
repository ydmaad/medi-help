"use client";

import React from "react";

interface CommunityTitleProps {
  text: string;
}

const CommunityTitle = ({ text }: CommunityTitleProps) => {
  return (
    <div className="text-gray-1000 font-bold text-[18px] line-clamp-1 overflow-hidden text-ellipsis">
      {text}
    </div>
  );
};

export default CommunityTitle;
