"use client";
import React from "react";

interface HeaderTextProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const HeaderText = ({ text, onClick, className }: HeaderTextProps) => {
  return (
    <span onClick={onClick} className={`text-[18px] ${className}`}>
      {text}
    </span>
  );
};

export default HeaderText;
