import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageNo = searchParams.get("pageNo") || "1"; // 페이지 번호를 URL 파라미터로 받음
  const numOfRows = searchParams.get("numOfRows") || "20"; // 한 페이지에 가져올 아이템 수
  const type = searchParams.get("type") || "json";

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_E_MEDI_URL}?serviceKey=${process.env.NEXT_PUBLIC_E_MEDI_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("네트워크 응답에 문제가 있습니다.");
    }

    const data = await response.json();
    const items = data.body.items || [];

    const formattedItems = items.map((item: any) => ({
      itemName: item.itemName,
      entpName: item.entpName,
      effect: item.efcyQesitm || "효능 정보 없음",
      itemImage: item.itemImage || null,
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
