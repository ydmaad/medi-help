import React from "react";
import Details from "@/components/templates/mypage/Details";
import Comments from "@/components/templates/mypage/Commnets";
import MediList from "@/components/templates/mypage/MediLists";

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Page</h1>
      <Details />
      <MediList />
      <Comments />
    </div>
  );
};

export default MyPage;
