import React from "react";

interface PageButtonProps {
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
}

const PageButton = ({ onClick, icon, disabled }: PageButtonProps) => {
  return (
    <button onClick={onClick} className="pagination-button" disabled={disabled}>
      {icon && <img src={icon} alt="icon" className="button-icon" />}
    </button>
  );
};

export default PageButton;
