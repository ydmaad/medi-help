import React from "react";

interface SidebarXBtnProps {
  onClick: () => void;
}

const SidebarXBtn = ({ onClick }: SidebarXBtnProps) => {
  return (
    <button onClick={onClick} className="ml-[73px] mr-[21px]">
      <img src="/sidbarxbtn.svg" alt="닫기" className="h-[24px]" />
    </button>
  );
};

export default SidebarXBtn;
