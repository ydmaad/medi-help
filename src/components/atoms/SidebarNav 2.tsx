import React from "react";

interface SidebarNavProps {
  imageSrc: string;
  text: string;
  href: string;
  onClick: () => void;
}

const SidebarNav = ({ imageSrc, text, href, onClick }: SidebarNavProps) => {
  const handleClick = () => {
    onClick();
    window.location.href = href;
  };

  return (
    <div
      className="flex items-center w-[267px] h-[64px] justify-start my-[20px] ml-[20px] mr-[8px]"
      onClick={handleClick}
    >
      <img src={imageSrc} alt={text} className="h-[24px] object-cover" />
      <span className="ml-[8px]">{text}</span>
    </div>
  );
};

export default SidebarNav;
