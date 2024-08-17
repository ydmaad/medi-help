"use client";

import React from "react";

interface CommunitySubTitleProps {
  text: string;
  lineClamp: string;
}

const CommunitySubTitle = ({ text, lineClamp }: CommunitySubTitleProps) => {
  return (
    <div
      className={`text-gray-800 text-[12px] desktop:text-[16px] ${lineClamp} overflow-hidden text-ellipsis mt-[2px]`}
    >
      {text}
    </div>
  );
};

export default CommunitySubTitle;
