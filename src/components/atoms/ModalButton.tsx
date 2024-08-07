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
        children === "저장" ? "" : `${viewEvents ? "block" : "hidden"}`
      } ${
        children === "저장" ? "bg-brand-primary-500" : "bg-brand-primary-50"
      } ${
        children === "저장" ? "text-white" : "text-brand-primary-500"
      } hover:scale-105 ease-in duration-300`}
    >
      {children}
    </button>
  );
};

export default ModalButton;
