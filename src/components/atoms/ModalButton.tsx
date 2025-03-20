import { EventInput } from "@fullcalendar/core";
import React from "react";

interface Props {
  children: string;
  handleClick: () => void;
  hasEvents?: boolean;
}

const ModalButton = ({ children, handleClick, hasEvents }: Props) => {
  return (
    <button
      onClick={handleClick}
      className={`w-[107px] h-[40px]  rounded-md text-sm font-semibold ${
        children === "삭제" ? `${hasEvents ? "block" : "hidden"}` : ""
      } ${
        children === "삭제" ? "bg-brand-primary-50" : "bg-brand-primary-500"
      } ${
        children === "삭제" ? "text-brand-primary-500" : "text-white"
      } hover:scale-105 ease-in duration-300`}
    >
      {children}
    </button>
  );
};

export default ModalButton;
