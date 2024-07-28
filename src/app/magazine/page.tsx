"use client";

import { useEffect, useState } from "react";
import SmCard from "@/components/molecules/SmCard";

type Magazine = {
  title: string;
  imgs_url: string;
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
    <div>
      <h1>매거진</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="grid grid-cols-3 gap-4">
        {magazines.map((magazine, index) => (
          <SmCard
            key={index}
            src={magazine.imgs_url}
            alt={magazine.title}
            title={magazine.title}
          />
        ))}
      </div>
    </div>
  );
};

export default MagazinePage;
