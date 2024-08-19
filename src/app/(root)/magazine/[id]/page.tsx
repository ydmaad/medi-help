"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackgroundTitle from "@/components/molecules/ImageOverlay";
import LgImage from "@/components/atoms/LgImage";

interface Magazine {
  id: string;
  title: string;
  imgs_url: string;
  subtitle: string;
  written_by: string;
  reporting_date: string;
  descriptions: string;
  leftText: string;
  rightText: string;
}

const MagazinePage = () => {
  const { id } = useParams();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMagazine = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/magazine/${id}`);
      if (!response.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
      }
      const result = await response.json();
      setMagazine(result.data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchMagazine();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!magazine) {
    return <p>로딩 중...</p>;
  }

  return (
    <>
      <div className="absolute inset-0 mt-[67px]">
        <BackgroundTitle
          title={magazine.title}
          backgroundImage={magazine.imgs_url}
          leftText={magazine.written_by}
          rightText={magazine.reporting_date}
        />
      </div>
      <div className="flex flex-col desktop:max-w-[1000px] mx-auto desktop:mt-[480px] mt-[310px] items-center justify-center">
        <LgImage src={magazine.imgs_url} alt={magazine.title} />
        <h4 className="text-base text-brand-gray-1000 desktop:mt-[50px] mt-[40px]">
          {magazine.descriptions}
        </h4>
      </div>
    </>
  );
};

export default MagazinePage;
