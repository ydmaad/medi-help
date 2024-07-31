import React from "react";

interface Props {
  handleCloseButtonClick: () => void;
}
const ModalCloseButton = ({ handleCloseButtonClick }: Props) => {
  return (
    <div className="text-xl font-thin" onClick={handleCloseButtonClick}>
      ✕
    </div>
  );
};

export default ModalCloseButton;
