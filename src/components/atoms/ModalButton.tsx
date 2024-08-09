import { EventInput } from "@fullcalendar/core";
import React from "react";

interface Props {
  children: string;
  handleClick: () => void;
  viewEvents?: boolean;
}

const ModalButton = ({ children, handleClick, viewEvents }: Props) => {
  return (
    <button
      onClick={handleClick}
      className={`w-24 h-10  rounded-md text-sm font-semibold ${
        children === "삭제" ? `${viewEvents ? "block" : "hidden"}` : ""
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
