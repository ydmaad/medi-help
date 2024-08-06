// src/app/(root)/mypage/page.tsx
import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";

import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/Posts";


const MyPage: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-8 py-4">
      <div className="flex justify-between">
        <UserBoard />
        <MediLists />
      </div>
      <div className="mt-8">
        <Posts/>
      </div>
    </div>
  );
};

export default MyPage;
