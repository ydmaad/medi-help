import { NextResponse } from "next/server";
import React from "react";

const GET = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const response = await fetch(`http://localhost:3000/community/${id}`);
  const data = response.json();
  console.log(data);
  return NextResponse.json(data);
};

export default GET;
