import React from "react";

interface Props {
  handleCloseButtonClick: () => void;
}
const ModalCloseButton = ({ handleCloseButtonClick }: Props) => {
  return (
    <div
      className="text-xl font-thin cursor-pointer hover:scale-110 ease-in duration-300"
      onClick={handleCloseButtonClick}
    >
      ✕
    </div>
  );
};

export default ModalCloseButton;
