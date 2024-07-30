"use client";

import React, { useEffect, useState } from "react";
import TertiColum from "@/components/molecules/TertiColum";
import Hero from "@/components/molecules/Hero";

type Magazine = {
  title: string;
  imgs_url: string;
  written_by: string;
  reporting_date: string;
};

const page = () => {
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

  return (
    <>
      <Hero />
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
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
    </>
  );
};

export default page;
