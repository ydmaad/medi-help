import React from "react";
import BgLinear from "@/components/atoms/BgLinear";
import MainLogo from "@/components/atoms/MainLogo";

const Hero = () => {
  return (
    <div className="relative mb-[79px]">
      <BgLinear />
      <div className="absolute inset-0 flex justify-center items-center">
        <MainLogo />
      </div>
    </div>
  );
};

export default Hero;
