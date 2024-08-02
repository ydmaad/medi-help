"use client";

import React from "react";
import HotTitle from "../atoms/HotTitle";
import CommunityTitle from "../atoms/CommunityTitle";
import CommunitySubTitle from "../atoms/CommunitySubTitle";
import ContentsImage from "../atoms/ContentsImage";
import NewTitle from "../atoms/NewTitle";

interface ContentsCardProps {
  communityTitle: string;
  imageSrc?: string | null;
  subTitle: string;
  hotTitle: string | null;
  newTitle: string | null;
}

const ContentsCard = ({
  communityTitle,
  imageSrc,
  subTitle,
  hotTitle,
  newTitle,
}: ContentsCardProps) => {
  return (
    <div className="w-[486px] h-[154px] rounded-[2px] bg-white flex ring-1 items-center p-4 ring-brand-gray-50 m-4">
      <div className="h-[106px] flex flex-col justify-between  flex-1">
        {newTitle && <NewTitle />}
        {hotTitle && <HotTitle />}
        <CommunityTitle text={communityTitle} />
        <CommunitySubTitle text={subTitle} />
      </div>
      <div className="ml-[48px]">
        <ContentsImage src={imageSrc} />
      </div>
    </div>
  );
};

export default ContentsCard;
