"use client";
import React from "react";
import TextButton from "../atoms/Textbutton";

const Navigation = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <TextButton text="알림" href="/mypage" />
      <TextButton text="ㅇㅇㅇ님" href="/columns" />
      {/*추후 수파베이스 연결 후 입력 바뀌게 설정할꺼임*/}
      <TextButton text="로그아웃" href="/auth/login" />
      {/*추후 수파베이스 연결 후 입력 바뀌게 설정할꺼임*/}
    </div>
  );
};

export default Navigation;
