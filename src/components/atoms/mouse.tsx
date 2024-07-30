import React from "react";

const Mouse = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-[208px]">
      <img src="/mouse.png" alt="mouse" />
      <h4 className="mt-[12px] text-brand-gray-1000 text-sm">
        스크롤을 내려보세요
      </h4>
    </div>
  );
};

export default Mouse;
