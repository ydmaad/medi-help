import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-left font-bold text-[32px] text-brand-gray-900 mb-10 mx-36 mt-20">
      {" "}
      {/*마진 좌우 수정해야함*/}
      {children}
    </h1>
  );
};

export default Title;
