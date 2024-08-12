import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-left font-bold text-[32px] text-brand-gray-900 mb-[8px] mt-[96px]">
      {children}
    </h1>
  );
};

export default Title;
