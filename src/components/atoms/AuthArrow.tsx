import React from "react";
import { FaChevronRight } from "react-icons/fa";

type AuthArrowProps = {
  onClick: () => void;
};

export const AuthArrow: React.FC<AuthArrowProps> = ({ onClick }) => (
  <button onClick={onClick} className="ml-2 text-gray-500 hover:text-gray-700">
    <FaChevronRight />
  </button>
);
