import React from "react";

interface CommunitySubTitleProps {
  text: string;
  hasImage: boolean;
}

const CommunitySubTitle = ({ text, hasImage }: CommunitySubTitleProps) => {
  return (
    <div
      className={` ${hasImage ? "w-[229px]" : "w-[303px]"}  h-[68px] ${hasImage ? "desktop:w-[290px]" : "desktop:w-[438px]"} overflow-hidden`}
    >
      <h2 className="text-[14px] desktop:text-base text-left line-clamp-2 overflow-hidden text-brand-gray-800 text-ellipsis">
        {text}
      </h2>
    </div>
  );
};

export default CommunitySubTitle;
