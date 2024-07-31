import React from "react";

interface SemiTitleType {
  children: string;
}

const SemiTitle = ({ children }: SemiTitleType) => {
  return <div className="text-sm text-brand-gray-600">{children}</div>;
};

export default SemiTitle;
