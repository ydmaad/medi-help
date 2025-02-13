"use client";

import { useEffect, useState } from "react";
import SmCard from "@/components/molecules/SmCard";
import Title from "@/components/atoms/Title";
import MagazineTitle from "@/components/atoms/MagazineTitle";
import Carousel from "@/components/molecules/Carousel";
import Pagination from "@/components/molecules/Pagination";
import ColumnCarousel from "@/components/molecules/ColumnCarousel";
import ColumnCard from "@/components/molecules/ColumnCard";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  const carouselImages = magazines.map((magazine) => ({
    src: magazine.imgs_url,
    alt: magazine.title,
    title: magazine.title,
    leftText: magazine.written_by,
    rightText: magazine.reporting_date,
    id: magazine.id,
  }));

  const indexOfLastMagazine = currentPage * itemsPerPage;
  const indexOfFirstMagazine = indexOfLastMagazine - itemsPerPage;
  const currentMagazines = magazines.slice(
    indexOfFirstMagazine,
    indexOfLastMagazine
  );

  const totalPages = Math.ceil(magazines.length / itemsPerPage);

  return (
    <div className="flex flex-col max-w-[335px] desktop:max-w-[1000px] mx-auto">
      <Title>👀 메디칼럼</Title>
      <span className="text-brand-gray-600 font-extrabold ">
        약에 관련된 모든 이야기를 전해드려요
      </span>
      <MagazineTitle text="에디터's PICK!" />
      <div className="hidden desktop:flex">
        {carouselImages.length > 0 ? (
          <Carousel images={carouselImages} />
        ) : (
          <p>슬라이드할 이미지가 없습니다.</p>
        )}
      </div>
      <div className="desktop:hidden ">
        <ColumnCarousel images={carouselImages} />
      </div>
      <MagazineTitle text="전체" />

      <div className="flex flex-col items-center">
        {error && <p className="text-red-500">{error}</p>}
        <div className="hidden desktop:flex">
          <div className="grid grid-cols-3 gap-[24px]">
            {currentMagazines.map((magazine) => (
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
        <div className="flex desktop:hidden  items-center mx-auto max-w-[335px]">
          <div className="grid grid-cols-1">
            {currentMagazines.map((magazine) => (
              <ColumnCard
                key={magazine.id}
                src=""
                alt=""
                imageSrc={magazine.imgs_url}
                title={magazine.title}
                subtitle={magazine.subtitle}
                leftText={magazine.written_by}
                rightText={magazine.reporting_date}
                id={magazine.id}
              />
            ))}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MagazinePage;
