import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_E_MEDI_URL}?serviceKey=${process.env.NEXT_PUBLIC_E_MEDI_KEY}&pageNo=1&numOfRows=100&type=json`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("API response not ok:", response.statusText);
      throw new Error("네트워크 응답에 문제가 있습니다.");
    }

    const data = await response.json();
    const items = data.body.items || [];

    const medicineNames = items.map((item: any) => ({
      itemName: item.itemName,
    }));


    return NextResponse.json(medicineNames);
  } catch (error) {
    console.error("Error fetching medicine names:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
