"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DropDownCard from "@/components/molecules/DropDownCard";
import DrugDetailCard from "@/components/molecules/DrugDetailCard";

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
      <h1 className="text-brand-gray-1000 text-[32px] font-bold mt-[159px]">
        {data.itemName}
      </h1>
      <DrugDetailCard
        imageUrl={data.itemImage}
        altText="약 이미지 설명"
        category="처방약"
        classification="일반의약품"
        manufacturer="제약회사 A"
        insuranceCode="12345"
        appearance="하얀색 정제"
        dosageForm="정제"
        shape="원형"
        color="흰색"
        size="10mm"
      />
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
