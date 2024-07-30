import React from "react";
import BgLinear from "@/components/atoms/BgLinear";
import MainLogo from "@/components/atoms/MainLogo";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0">
        <BgLinear />
      </div>
      <div className="mt-[206px] mb-[349px] z-10">
        <div className="mb-6 z-10">
          <MainLogo />
        </div>
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;
