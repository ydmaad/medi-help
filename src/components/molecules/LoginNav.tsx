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

// 로그아웃 버튼 onclick 이벤트
// 주스탠드 스토어 안에 저장되어있는 전역적 관리하는 유저정보 날리는 로직 구현
// 방법 ? 주스탠드 로그아웃 매서드 만들어놓은 것을 가져와서 쓰는것으로 구현
