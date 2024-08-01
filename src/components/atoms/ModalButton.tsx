import React from "react";

interface Props {
  children: string;
  handleSubmitClick: () => void;
}

const ModalButton = ({ children, handleSubmitClick }: Props) => {
  return (
    <button
      onClick={handleSubmitClick}
      className="w-24 h-10 bg-brand-primary-500 rounded-md text-white hover:scale-105 ease-in duration-300"
    >
      {children}
    </button>
  );
};

export default ModalButton;
