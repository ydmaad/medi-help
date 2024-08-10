"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DropDownCard from "@/components/molecules/DropDownCard";

interface MedicineData {
  itemName: string;
  entpName: string;
  itemImage: string;
  efcyQesitm: string;
  useMethodQesitm: string;
  atpnQesitm: string;
  intrcQesitm: string;
  seQesitm: string;
  depositMethodQesitm: string;
}

export default function SearchPage() {
  const { id } = useParams();
  const [data, setData] = useState<MedicineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await fetch(`/api/search/${id}`);
        const result = await response.json();
        setData(result[0]);
        setLoading(false);
      };

      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center">No data found</div>;
  }

  return (
    <div className="text-center mt-[67px]">
      <DropDownCard
        title="효능 효과"
        buttonImage="/dropdownbtn.svg"
        hiddenText={[data.efcyQesitm]}
      />
      <DropDownCard
        title="용법 및 용량"
        buttonImage="/dropdownbtn.svg"
        hiddenText={[data.useMethodQesitm]}
      />

      <DropDownCard
        title="사용상 주의사항"
        buttonImage="/dropdownbtn.svg"
        hiddenText={[
          data.atpnQesitm,
          data.intrcQesitm,
          data.seQesitm,
          data.depositMethodQesitm,
        ]}
      />
    </div>
  );
}
