"use client";
import React from "react";
import TextButton from "../atoms/Textbutton";
import { useAuthStore } from "@/store/auth";

const Navigation = () => {
  const { user } = useAuthStore();

  return (
    <div className="grid grid-cols-4 gap-[8px]">
      <TextButton text="약 검색" href="/search" />
      <TextButton text="칼럼" href="/magazine" />
      <TextButton text="커뮤니티" href="/community" />
      <TextButton text="캘린더" href={user ? "/calendar" : "/auth/login"} />
    </div>
  );
};

export default Navigation;
