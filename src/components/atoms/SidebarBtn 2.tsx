import React from "react";

interface SidebarBtnProps {
  text: string;
  href: string;
  onClick: () => void;
}

const SidebarBtn = ({ text, href, onClick }: SidebarBtnProps) => {
  const handleClick = () => {
    onClick();
    window.location.href = href;
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center mr-[9px] w-[109px] h-[32px] rounded-[4px] bg-brand-primary-50 text-brand-primary-500 hover:bg-brand-primary-100 transition duration-200 cursor-pointer"
    >
      {text}
    </div>
  );
};

export default SidebarBtn;
