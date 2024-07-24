// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageNo = 1, numOfRows = 100, type = "json" } = req.query; // numOfRows를 더 큰 값으로 설정

  try {
    const apiUrl = `${process.env.BASE_URL}?serviceKey=${process.env.API_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("네트워크 응답에 문제가 있습니다.");
    }

    const data = await response.json();

    const items = data.response.body.items || [];
    const formattedItems = items.map((item: any) => ({
      itemName: item.itemName,
      entpName: item.entpName,
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
}
