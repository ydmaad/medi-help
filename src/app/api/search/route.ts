import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageNo = parseInt(url.searchParams.get("pageNo") || "1");
  const numOfRows = parseInt(url.searchParams.get("numOfRows") || "20");
  const searchTerm = url.searchParams.get("searchTerm") || "";

  try {
    const { data, error, count } = await supabase
      .from("search_medicine")
      .select("*", { count: "exact" })
      .ilike("itemName", `%${searchTerm}%`)
      .range((pageNo - 1) * numOfRows, pageNo * numOfRows - 1);

    if (error) {
      return NextResponse.json(
        { error: "데이터 조회 실패", message: error.message },
        { status: 400 }
      );
    }

    const responseData = data.map((item) => ({
      itemName: item.itemName,
      entpName: item.entpName,
      effect: item.efcyQesitm || "효능 정보 없음",
      itemImage: item.itemImage,
      id: item.id,
    }));

    const totalItems = count || 0;

    return NextResponse.json(
      { message: "조회 성공", totalItems, items: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
