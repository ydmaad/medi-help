"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface MedicineData {
  itemName: string;
  entpName: string;
  itemImage: string;
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
        setData(result[0]); // Assuming the API returns an array of results
        setLoading(false);
      };

      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <h1>{data.itemName}</h1>
        <h3>{data.entpName}</h3>
      </div>
      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <small>기본 정보</small>
        <div
          style={{
            width: "486px",
            height: "hug-content",
            margin: "44px auto",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <img
            src={data.itemImage}
            alt={data.itemName}
            style={{
              width: "398px",
              height: "220px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <small>용법 및 용량</small>
        <p>{data.useMethodQesitm}</p>
      </div>
      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <small>사용상 주의사항</small>
        <p>{data.atpnQesitm}</p>
        <p>{data.intrcQesitm}</p>
        <p>{data.seQesitm}</p>
        <p>{data.depositMethodQesitm}</p>
      </div>
    </div>
  );
}
