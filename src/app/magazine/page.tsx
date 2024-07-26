"use client";

import { useEffect, useState } from "react";

type Magazine = {
  title: string;
  subtitle: string;
  imgs_url: string;
  descriptions: string;
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
      <ul>
        {magazines.map((magazine, index) => (
          <li key={index}>
            <h2>{magazine.title}</h2>
            <img src={magazine.imgs_url} alt={magazine.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MagazinePage;
