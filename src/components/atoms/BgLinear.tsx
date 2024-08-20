import React from "react";

const BgLinear = () => {
  return (
    <>
      <div className="relative hidden desktop:flex overflow-hidden  h-screen">
        <img src="/bg.svg" alt="bg" className="absolute w-full  z-0" />
      </div>
      <div className=" flex desktop:hidden justify-center items-center mt-[70px] overflow-hidden">
        <img src="/mobilebg.svg" alt="bg" className="absolute w-full z-0" />
      </div>
    </>
  );
};

export default BgLinear;
