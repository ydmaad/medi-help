import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shape = searchParams.get("shape") || "";
  const color = searchParams.get("color") || "";
  const formulation = searchParams.get("formulation") || "";
  const splitLine = searchParams.get("splitLine") || "";

  if (!shape && !color && !formulation && !splitLine) {
    return NextResponse.json(
      { error: "검색 조건이 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_MEDI_SEARCH_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_MEDI_SEARCH_URL;

  const response = await fetch(
    `${baseUrl}/getMdcinGrnIdntfcInfoList01?serviceKey=${apiKey}&pageNo=1&numOfRows=10&type=json&shape=${shape}&color=${color}&formulation=${formulation}&splitLine=${splitLine}`
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
