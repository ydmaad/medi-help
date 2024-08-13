// src/app/(root)/mypage/page.tsx

import React from "react";
import MediLists from "@/components/templates/mypage/MediLists";
import UserBoard from "@/components/templates/mypage/UserBoard";
import Posts from "@/components/templates/mypage/posts";

const MyPage: React.FC = () => {
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto px-60 py-4 mt-20 gap-8">

      <div className="flex flex-row justify-start w-full gap-6">

        <div className="flex-1 max-w-[35%]">

          <UserBoard className="h-full" />
        </div>
        <div className="flex-1 max-w-[65%]">

          <MediLists className="h-full" />
        </div>
      </div>
      <div>
        <Posts />
      </div>
    </div>
  );
};

export default MyPage;
