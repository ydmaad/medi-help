"use client";

import React from "react";

interface CommunitySubTitleProps {
  text: string;
}

const CommunitySubTitle = ({ text }: CommunitySubTitleProps) => {
  return (
    <div className="text-gray-800 text-[16px] line-clamp-2 overflow-hidden text-ellipsis ">
      {text}
    </div>
  );
};

export default CommunitySubTitle;
