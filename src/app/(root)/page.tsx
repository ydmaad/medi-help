"use client";

import React, { useEffect, useState } from "react";
import TertiColum from "@/components/molecules/TertiColum";
import MainColum from "@/components/molecules/MainColum";
import SubColum from "@/components/molecules/SubColum";
import Hero from "@/components/molecules/Hero";
import LoadMoreButton from "@/components/atoms/LoadMoreButton";
import MainTitle from "@/components/atoms/MainTitle";
import ContentsCard from "@/components/molecules/ContentsCard";

type Magazine = {
  title: string;
  imgs_url: string;
  written_by: string;
  reporting_date: string;
};

const Page: React.FC = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMagazines = async () => {
    try {
      const response = await fetch("/api/magazine");
      if (!response.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
      }
      const result = await response.json();
      setMagazines(result.data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const limitedMagazines = magazines.slice(0, 3);
  const limitedMainMagazines = magazines.slice(0, 1);
  const limitedSubMagazines = magazines.slice(1, 2);

  return (
    <>
      <Hero />
      <div className="flex justify-between mx-36 mb-[10px]">
        <MainTitle text="메거진" />
        <LoadMoreButton targetPage="/magazine" />
      </div>
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex">
          {limitedMainMagazines.map((magazine, index) => (
            <MainColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
            />
          ))}
          {limitedSubMagazines.map((magazine, index) => (
            <SubColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-[26px]">
          {limitedMagazines.map((magazine, index) => (
            <TertiColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mx-36 mb-[10px]">
        <MainTitle text="커뮤니티" />
        <LoadMoreButton targetPage="/community" />
      </div>
      <div className="flex justify-center items-center">
        {/* 첫 번째 ContentsCard 3개 세로 정렬 */}
        <div className="grid grid-cols-1 gap-4">
          <ContentsCard
            hotTitle="🔥️ HOT"
            newTitle={null} /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 1"
            imageSrc="https://via.placeholder.com/100"
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
          <ContentsCard
            hotTitle="🔥️ HOT"
            newTitle={null} /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 2"
            imageSrc={null}
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
          <ContentsCard
            hotTitle="🔥️ HOT"
            newTitle={null} /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 3"
            imageSrc={null}
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
        </div>
        {/* 나중에 커뮤니티 데이터 받아오는 로직 작성 이후 변경 최신순과 인기순 정렬로 진행 예정 버튼으로 해당 페이지로 이동 하게 하는것도 추후 구현  */}
        <div className="grid grid-cols-1 gap-4 ">
          <ContentsCard
            hotTitle={null}
            newTitle="✨ NEW" /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 A"
            imageSrc="https://via.placeholder.com/100"
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
          <ContentsCard
            hotTitle={null}
            newTitle="✨ NEW" /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 B"
            imageSrc={null}
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
          <ContentsCard
            hotTitle={null}
            newTitle="✨ NEW" /*✨ NEW로 변경해서 사용 가능 */
            communityTitle="커뮤니티 제목 C"
            imageSrc={null}
            subTitle="이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다.이것은 서브 제목입니다."
          />
        </div>
      </div>
    </>
  );
};

export default Page;
