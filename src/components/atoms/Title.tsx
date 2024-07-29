import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-left font-bold text-[32px] text-gray-900 mb-10 mt-20">
      {children}
    </h1>
  );
};

export default Title;
