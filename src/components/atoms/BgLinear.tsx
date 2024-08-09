import React from "react";

const BgLinear = () => {
  return (
    <div className="relative flex justify-center items-center">
      <img
        src="/mainbg.svg"
        alt="mainbg"
        className="w-full h-[850px] bg-brand-primary-500"
      />
      <img
        src="/mascot.svg"
        alt="bgtop"
        className="absolute right-16 bottom-48 z-10"
      />
      <img
        src="/spaceship.svg"
        alt="bgtop"
        className="absolute left-32 bottom-48 z-10"
      />
      <img src="/bgtop.svg" alt="bgtop" className="absolute bottom-0  w-full" />
    </div>
  );
};

export default BgLinear;
