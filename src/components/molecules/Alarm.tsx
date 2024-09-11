import React from "react";
import SidebarXBtn from "../atoms/SidebarXBtn";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmComponent = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <div className="w-[432px] h-[434px] rounded-[20px] flex flex-col justify-center items-center m-[-24px] bg-white shadow-lg">
      <div className="flex">
        <h2 className="text-[16px] font-bold text-center text-brand-gray-800">
          알람
        </h2>
        <SidebarXBtn onClick={onClose} />
      </div>
    </div>
  );
};

export default AlarmComponent;
