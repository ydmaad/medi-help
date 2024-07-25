import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Foo bar");

  return NextResponse.json("Hello World");
}
