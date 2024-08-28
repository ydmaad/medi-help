"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  id: string;
}

const ContentsCard = ({
  communityTitle,
  imageSrc,
  subTitle,
  hotTitle,
  newTitle,
  id,
}: ContentsCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/community/${id}`);
  };
  return (
    <div
      className="w-[335px]  h-[121px] desktop:w-[486px] desktop:h-[154px] rounded-[8px] bg-white flex ring-1 items-center ring-brand-gray-50 p-[16px] desktop:p-[24px] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-1 flex flex-col  justify-between mt-[25px]">
        {newTitle && <NewTitle />}
        {hotTitle && <HotTitle />}
        <CommunityTitle text={communityTitle} />
        <CommunitySubTitle
          text={subTitle}
          hasImage={!!(imageSrc && imageSrc.length > 0)}
        />
      </div>
      <div className="desktop:h-[106px] ml-[14px] desktop:ml-[48px] flex-shrink-0 mt-[25px] desktop:mt-[0px]">
        <ContentsImage src={imageSrc} />
      </div>
    </div>
  );
};

export default ContentsCard;
