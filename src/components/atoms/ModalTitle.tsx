import React from "react";

interface ModalTitleType {
  children: string;
}
const ModalTitle = ({ children }: ModalTitleType) => {
  return (
    <div className="flex items-center text-md font-semibold ">{children}</div>
  );
};

export default ModalTitle;
