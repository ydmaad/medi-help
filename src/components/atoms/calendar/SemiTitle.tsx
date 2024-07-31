import React from "react";

interface SemiTitleType {
  children: string;
}

const SemiTitle = ({ children }: SemiTitleType) => {
  return <div>{children}</div>;
};

export default SemiTitle;
