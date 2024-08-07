import React from "react";
import { useRouter } from "next/navigation";
import BgLinear from "@/components/atoms/BgLinear";
import MainLogo from "@/components/atoms/MainLogo";
import SearchBar from "./SearchBar";
import Mouse from "@/components/atoms/mouse";

const Hero = () => {
  const router = useRouter();

  const handleSearchChange = (searchTerm: string) => {
    if (searchTerm) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center ">
      <div className="mt-[206px] mb-[106px] z-10">
        <div className="mb-6 z-10">
          <MainLogo />
        </div>
        <SearchBar onSearchChange={handleSearchChange} />
        <Mouse />
      </div>
    </div>
  );
};

export default Hero;
