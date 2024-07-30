"use client";
import React from "react";
import TextButton from "../atoms/Textbutton";

const Navigation = () => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <TextButton text="약 검색" href="/search" />
      <TextButton text="메거진" href="/magazine" />
      <TextButton text="커뮤니티" href="/community" />
      <TextButton text="캘린더" href="/calendar" />
    </div>
  );
};

export default Navigation;
