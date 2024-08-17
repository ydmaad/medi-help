import React from "react";

interface CommunitySubTitleProps {
  text: string;
}
const CommunitySubTitle = ({ text }: CommunitySubTitleProps) => {
  return (
    <div className="w-[290px] overflow-hidden">
      <h2 className="text-base text-left line-clamp-2 overflow-hidden text-brand-gray-800 text-ellipsis  ">
        {text}
      </h2>
    </div>
  );
};

export default CommunitySubTitle;
