import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const numOfRows = searchParams.get("numOfRows") || "100";
  const type = searchParams.get("type") || "json";

  try {
    const allItems = [];
    let pageNo = 1;
    let moreData = true;

    while (moreData) {
      const apiUrl = `${process.env.NEXT_PUBLIC_E_MEDI_URL}?serviceKey=${process.env.NEXT_PUBLIC_E_MEDI_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      const items = data.body.items || [];

      // 필터링 및 데이터 포맷팅
      const formattedItems = items
        .filter((item: any) => item.itemImage)
        .map((item: any) => ({
          itemName: item.itemName,
          entpName: item.entpName,
          effect: item.efcyQesitm || "효능 정보 없음",
          itemImage: item.itemImage,
        }));

      if (formattedItems.length > 0) {
        allItems.push(...formattedItems);
        pageNo++;
      } else {
        moreData = false;
      }
    }

    return NextResponse.json(allItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
