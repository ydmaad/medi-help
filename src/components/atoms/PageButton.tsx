import React from "react";

interface PageButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
  disabled?: boolean;
}

const PageButton = ({ onClick, children, icon, disabled }: PageButtonProps) => {
  return (
    <button onClick={onClick} className="pagination-button" disabled={disabled}>
      {icon && <img src={icon} alt="icon" className="button-icon" />}
      {children}
    </button>
  );
};

export default PageButton;
