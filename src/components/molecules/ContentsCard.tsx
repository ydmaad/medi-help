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
    <div className="w-[486px] h-[154px] rounded-[2px] bg-white p-4 flex ring-1 ring-brand-gray-50 m-4">
      <div className="flex flex-col justify-between ml-4">
        {newTitle && <NewTitle />}
        {hotTitle && <HotTitle />}
        <CommunityTitle text={communityTitle} />
        <CommunitySubTitle text={subTitle} />
      </div>
      <ContentsImage src={imageSrc} />
    </div>
  );
};

export default ContentsCard;
