import React from "react";

interface PageButtonProps {
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
}

const PageButton = ({ onClick, icon, disabled }: PageButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="pagination-button flex items-center"
      disabled={disabled}
    >
      {icon && (
        <div className="relative flex items-center justify-center  mr-2">
          <img src={icon} alt="icon" className="w-6 h-6" />
        </div>
      )}
    </button>
  );
};

export default PageButton;
