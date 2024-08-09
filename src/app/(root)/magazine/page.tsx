"use client";

import { useEffect, useState } from "react";
import SmCard from "@/components/molecules/SmCard";
import Title from "@/components/atoms/Title";
import MagazineTitle from "@/components/atoms/MagazineTitle";

type Magazine = {
  id: string;
  title: string;
  imgs_url: string;
  subtitle: string;
  written_by: string;
  reporting_date: string;
};

const MagazinePage = () => {
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

  return (
    <>
      <Title>👀 메디칼럼</Title>
      <span className="text-brand-gray-600 font-extrabold mb-[60px]">
        약에 관련된 모든 이야기를 전해드려요
      </span>
      <MagazineTitle text="에디터's PICK!" />
      <MagazineTitle text="전체" />
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          {magazines.map((magazine) => (
            <SmCard
              key={magazine.id}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              subtitle={magazine.subtitle}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
              id={magazine.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MagazinePage;
