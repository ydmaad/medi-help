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
    <div className="w-full rounded-[2px] bg-white flex ring-1 items-center p-4 ring-brand-gray-50 mb-[24px] ">
      <div className="flex-1 flex flex-col justify-between ">
        {newTitle && <NewTitle />}
        {hotTitle && <HotTitle />}
        <CommunityTitle text={communityTitle} />
        <CommunitySubTitle text={subTitle} />
      </div>
      <div className="ml-[48px] flex-shrink-0 w-[106px] aspect-[1/1]">
        <ContentsImage src={imageSrc} />
      </div>
    </div>
  );
};

export default ContentsCard;
